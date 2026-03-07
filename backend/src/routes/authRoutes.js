const express = require('express');
const router = express.Router();

const { requestOtp, verifyOtp, completeRegistration } = require('../controllers/authController');

/**
 * Auth Routes — 3-Step Registration Flow
 * Base path: /api/auth
 *
 * Step 1: POST /api/auth/request-otp          → generate & "send" OTP
 * Step 2: POST /api/auth/verify-otp           → verify OTP, receive registration_token
 * Step 3: POST /api/auth/complete-registration → fill profile, receive JWT
 */

// Step 1 — Request OTP
router.post('/request-otp', requestOtp);

// Step 2 — Verify OTP
router.post('/verify-otp', verifyOtp);

// Step 3 — Complete Registration
router.post('/complete-registration', completeRegistration);

module.exports = router;
