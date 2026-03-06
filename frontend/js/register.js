/**
 * register.js — 3-Step Registration Flow
 * GitTool Nhom9
 */

'use strict';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const API_BASE = '/api/auth';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let userEmail = '';
let registrationToken = '';

// ---------------------------------------------------------------------------
// DOM References
// ---------------------------------------------------------------------------
const step1El = document.getElementById('step1');
const step2El = document.getElementById('step2');
const step3El = document.getElementById('step3');
const successEl = document.getElementById('step-success');

const form1 = document.getElementById('form-step1');
const form2 = document.getElementById('form-step2');
const form3 = document.getElementById('form-step3');

const btn1 = document.getElementById('btn-step1');
const btn2 = document.getElementById('btn-step2');
const btn3 = document.getElementById('btn-step3');
const btnResend = document.getElementById('btn-resend');

const emailInput = document.getElementById('email');
const otpInput = document.getElementById('otp');
const usernameInput = document.getElementById('username');
const fullNameInput = document.getElementById('fullName');
const passwordInput = document.getElementById('password');
const displayEmail = document.getElementById('display-email');
const errorBanner = document.getElementById('errorBanner');

// Step indicators
const indicators = [1, 2, 3].map(n => document.getElementById(`indicator-${n}`));
const stepLines = document.querySelectorAll('.step-line');

// Password strength
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

// Password toggle
const togglePasswordBtn = document.getElementById('togglePassword');
const eyeShow = document.getElementById('eye-show');
const eyeHide = document.getElementById('eye-hide');

// ---------------------------------------------------------------------------
// UI Helpers
// ---------------------------------------------------------------------------

/** Show an error in the banner. Pass null to hide. */
function showError(message) {
    if (!message) {
        errorBanner.textContent = '';
        errorBanner.classList.add('hidden');
        return;
    }
    errorBanner.textContent = message;
    errorBanner.classList.remove('hidden');
    // Re-trigger shake animation
    errorBanner.style.animation = 'none';
    void errorBanner.offsetWidth; // reflow
    errorBanner.style.animation = '';
}

/** Transition to a new step (1–3) or 'success'. */
function goToStep(step) {
    showError(null);

    const sections = { 1: step1El, 2: step2El, 3: step3El, success: successEl };
    Object.values(sections).forEach(el => el.classList.add('hidden'));
    sections[step].classList.remove('hidden');

    // Update step indicator dots
    if (step === 'success') {
        indicators.forEach(ind => ind.classList.remove('active'));
        indicators.forEach(ind => ind.classList.add('done'));
        stepLines.forEach(line => line.classList.add('done'));
        return;
    }

    indicators.forEach((ind, i) => {
        ind.classList.remove('active', 'done');
        if (i + 1 < step) {
            ind.classList.add('done');
            if (stepLines[i]) stepLines[i].classList.add('done');
        } else if (i + 1 === step) {
            ind.classList.add('active');
        }
    });
}

/** Toggle loading state on a button. */
function setLoading(btn, isLoading) {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = isLoading;
    text.classList.toggle('hidden', isLoading);
    spinner.classList.toggle('hidden', !isLoading);
}

// ---------------------------------------------------------------------------
// API Helper
// ---------------------------------------------------------------------------

/**
 * POST JSON to the given path and return the parsed response body.
 * Throws an Error with the server's message on non-2xx responses.
 */
async function apiPost(path, payload) {
    const response = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
}

// ---------------------------------------------------------------------------
// Step 1 — Request OTP
// ---------------------------------------------------------------------------
form1.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(null);

    const email = emailInput.value.trim();
    if (!email) {
        showError('Please enter your email address.');
        return;
    }

    setLoading(btn1, true);
    try {
        await apiPost('/request-otp', { email });
        userEmail = email;
        displayEmail.textContent = email;
        goToStep(2);
        otpInput.focus();
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(btn1, false);
    }
});

// ---------------------------------------------------------------------------
// Step 2 — Verify OTP
// ---------------------------------------------------------------------------
form2.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(null);

    const otp = otpInput.value.trim();
    if (!/^\d{6}$/.test(otp)) {
        showError('Please enter the 6-digit code from your email.');
        return;
    }

    setLoading(btn2, true);
    try {
        const data = await apiPost('/verify-otp', { email: userEmail, otp });
        registrationToken = data.registration_token;
        goToStep(3);
        usernameInput.focus();
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(btn2, false);
    }
});

// Resend OTP
btnResend.addEventListener('click', async () => {
    showError(null);
    btnResend.disabled = true;
    btnResend.textContent = 'Sending…';
    try {
        await apiPost('/request-otp', { email: userEmail });
        otpInput.value = '';
        otpInput.focus();
        showError(null);
        // Show brief confirmation using the error banner styled as info
        errorBanner.style.background = 'rgba(99,102,241,0.12)';
        errorBanner.style.borderColor = 'rgba(99,102,241,0.35)';
        errorBanner.style.color = '#a5b4fc';
        errorBanner.textContent = 'A new code has been sent.';
        errorBanner.classList.remove('hidden');
        setTimeout(() => {
            showError(null);
            errorBanner.removeAttribute('style');
        }, 3000);
    } catch (err) {
        showError(err.message);
    } finally {
        // Cooldown: disable resend for 30 s
        let seconds = 30;
        const tick = setInterval(() => {
            seconds--;
            btnResend.textContent = `Resend code (${seconds}s)`;
            if (seconds <= 0) {
                clearInterval(tick);
                btnResend.disabled = false;
                btnResend.textContent = 'Resend code';
            }
        }, 1000);
    }
});

// Auto-advance when 6 digits are typed
otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
    if (otpInput.value.length === 6) {
        form2.requestSubmit();
    }
});

// ---------------------------------------------------------------------------
// Step 3 — Complete Registration
// ---------------------------------------------------------------------------
form3.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(null);

    const username = usernameInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !fullName || !password) {
        showError('All fields are required.');
        return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
        showError('Username must be 3–30 chars: letters, numbers, underscores only.');
        return;
    }
    if (password.length < 8) {
        showError('Password must be at least 8 characters.');
        return;
    }

    setLoading(btn3, true);
    try {
        await apiPost('/complete-registration', {
            registration_token: registrationToken,
            username,
            fullName,
            password,
        });

        goToStep('success');

        // Redirect after 3 seconds (matches the CSS fillBar animation)
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(btn3, false);
    }
});

// ---------------------------------------------------------------------------
// Password Strength Meter
// ---------------------------------------------------------------------------
passwordInput.addEventListener('input', () => {
    const val = passwordInput.value;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
        { label: '', color: 'transparent', width: '0%' },
        { label: 'Weak', color: '#ef4444', width: '25%' },
        { label: 'Fair', color: '#f59e0b', width: '50%' },
        { label: 'Good', color: '#3b82f6', width: '75%' },
        { label: 'Strong', color: '#22c55e', width: '100%' },
        { label: 'Strong', color: '#22c55e', width: '100%' },
    ];
    const level = levels[Math.min(score, 5)];
    strengthFill.style.width = val.length === 0 ? '0%' : level.width;
    strengthFill.style.backgroundColor = level.color;
    strengthLabel.textContent = val.length === 0 ? '' : level.label;
    strengthLabel.style.color = level.color;
});

// ---------------------------------------------------------------------------
// Toggle Password Visibility
// ---------------------------------------------------------------------------
togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeShow.classList.toggle('hidden', isPassword);
    eyeHide.classList.toggle('hidden', !isPassword);
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
});
