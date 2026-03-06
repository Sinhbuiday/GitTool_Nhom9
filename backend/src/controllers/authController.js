const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ---------------------------------------------------------------------------
// In-memory stores (replace with Redis in production)
// ---------------------------------------------------------------------------

/**
 * otpStore: email → { otp, expiresAt }
 * Holds unverified OTPs for Step 1 → Step 2.
 */
const otpStore = new Map();

/**
 * registrationTokenStore: token → { email, expiresAt }
 * Holds short-lived tokens issued after OTP verification, for Step 2 → Step 3.
 */
const registrationTokenStore = new Map();

/**
 * usersDB: email → user object (mock database)
 * Replace with a real DB call (mongoose / pg) in production.
 */
const usersDB = new Map();

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const OTP_TTL_MS = 5 * 60 * 1000;          // 5 minutes
const REG_TOKEN_TTL_MS = 15 * 60 * 1000;   // 15 minutes
const BCRYPT_ROUNDS = 12;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a cryptographically random 6-digit OTP string. */
function generateOtp() {
    // crypto.randomInt is available in Node.js >= 14.10
    return String(crypto.randomInt(100000, 999999));
}

/** Generate a secure random registration token. */
function generateRegistrationToken() {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Purge expired entries from a Map whose values have an `expiresAt` field.
 * Called lazily before reads/writes to keep memory usage bounded.
 */
function purgeExpired(store) {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
        if (value.expiresAt <= now) store.delete(key);
    }
}

// ---------------------------------------------------------------------------
// Step 1 — POST /api/auth/request-otp
// Body: { email }
// ---------------------------------------------------------------------------

/**
 * @desc   Generate and "send" a 6-digit OTP to the supplied email address.
 * @route  POST /api/auth/request-otp
 * @access Public
 */
const requestOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ success: false, message: 'A valid email is required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Prevent OTP flooding: if an unexpired OTP already exists, reject early.
        purgeExpired(otpStore);
        if (otpStore.has(normalizedEmail)) {
            return res.status(429).json({
                success: false,
                message: 'An OTP was already sent. Please wait before requesting a new one.',
            });
        }

        const otp = generateOtp();
        otpStore.set(normalizedEmail, {
            otp,
            expiresAt: Date.now() + OTP_TTL_MS,
        });

        // --- Mock email delivery (replace with nodemailer / SendGrid / AWS SES) ---
        console.log(`[AUTH] OTP for ${normalizedEmail}: ${otp}  (expires in 5 min)`);
        // --------------------------------------------------------------------------

        return res.status(200).json({
            success: true,
            message: `OTP sent to ${normalizedEmail}. It expires in 5 minutes.`,
            // DEV ONLY — remove in production:
            ...(process.env.NODE_ENV !== 'production' && { _dev_otp: otp }),
        });
    } catch (error) {
        console.error('[requestOtp]', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ---------------------------------------------------------------------------
// Step 2 — POST /api/auth/verify-otp
// Body: { email, otp }
// ---------------------------------------------------------------------------

/**
 * @desc   Verify the OTP and return a short-lived registration token.
 * @route  POST /api/auth/verify-otp
 * @access Public
 */
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        purgeExpired(otpStore);
        const record = otpStore.get(normalizedEmail);

        if (!record) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found for this email, or it has expired. Request a new one.',
            });
        }

        // Constant-time comparison to prevent timing attacks
        const otpBuffer = Buffer.from(record.otp);
        const inputBuffer = Buffer.from(String(otp));
        const isMatch =
            otpBuffer.length === inputBuffer.length &&
            crypto.timingSafeEqual(otpBuffer, inputBuffer);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid OTP.' });
        }

        // OTP consumed — delete immediately to prevent reuse
        otpStore.delete(normalizedEmail);

        // Issue a registration token
        const registrationToken = generateRegistrationToken();
        registrationTokenStore.set(registrationToken, {
            email: normalizedEmail,
            expiresAt: Date.now() + REG_TOKEN_TTL_MS,
        });

        return res.status(200).json({
            success: true,
            message: 'OTP verified. Use the registration_token to complete your profile.',
            registration_token: registrationToken,
        });
    } catch (error) {
        console.error('[verifyOtp]', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

// ---------------------------------------------------------------------------
// Step 3 — POST /api/auth/complete-registration
// Body: { registration_token, username, fullName, password }
// ---------------------------------------------------------------------------

/**
 * @desc   Complete registration: validate token, hash password, persist user, return JWT.
 * @route  POST /api/auth/complete-registration
 * @access Public
 */
const completeRegistration = async (req, res) => {
    try {
        const { registration_token, username, fullName, password } = req.body;

        // --- Input validation ---
        if (!registration_token || !username || !fullName || !password) {
            return res.status(400).json({
                success: false,
                message: 'registration_token, username, fullName, and password are all required.',
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long.',
            });
        }

        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 3–30 characters and contain only letters, numbers, or underscores.',
            });
        }

        // --- Validate registration token ---
        purgeExpired(registrationTokenStore);
        const tokenRecord = registrationTokenStore.get(registration_token);

        if (!tokenRecord) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired registration token. Please restart the registration process.',
            });
        }

        const { email } = tokenRecord;

        // Token consumed — delete to prevent reuse
        registrationTokenStore.delete(registration_token);

        // --- Check for duplicate email / username (mock DB check) ---
        for (const user of usersDB.values()) {
            if (user.email === email) {
                return res.status(409).json({ success: false, message: 'This email is already registered.' });
            }
            if (user.username === username.toLowerCase().trim()) {
                return res.status(409).json({ success: false, message: 'Username is already taken.' });
            }
        }

        // --- Hash password ---
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        // --- Persist user (mock DB — replace with mongoose.save() / pg query) ---
        const newUser = {
            id: crypto.randomUUID(),
            email,
            username: username.toLowerCase().trim(),
            fullName: fullName.trim(),
            passwordHash,
            createdAt: new Date().toISOString(),
        };
        usersDB.set(newUser.id, newUser);

        console.log(`[AUTH] New user registered: ${newUser.email} (id: ${newUser.id})`);

        // --- Issue JWT ---
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('[AUTH] JWT_SECRET is not set in environment variables!');
            return res.status(500).json({ success: false, message: 'Server configuration error.' });
        }

        const token = jwt.sign(
            { sub: newUser.id, email: newUser.email, username: newUser.username },
            jwtSecret,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        // Return the user profile without the password hash
        const { passwordHash: _omit, ...publicProfile } = newUser;

        return res.status(201).json({
            success: true,
            message: 'Registration complete. Welcome!',
            token,
            user: publicProfile,
        });
    } catch (error) {
        console.error('[completeRegistration]', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = { requestOtp, verifyOtp, completeRegistration };
