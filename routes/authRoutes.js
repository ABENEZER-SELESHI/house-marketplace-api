//routes/authRoutes.js
const express = require('express');
const { register, login, verifyEmail, resendVerificationEmail } = require('../controllers/authController.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

module.exports = router;
