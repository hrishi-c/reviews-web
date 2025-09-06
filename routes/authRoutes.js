const express = require('express');
const router = express.Router();
const {
    patientLogin,
    sendOTP,
    verifyOTPController
} = require('../controllers/authController');

router.get('/login', (req, res) => {
    res.render('auth/login');
});

router.post('/patient-login', patientLogin);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);

module.exports = router;
