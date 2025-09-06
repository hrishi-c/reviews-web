const { saveOTP, verifyOTP } = require('../models/otpModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTP(req, res) {
    try {
        const email = process.env.RECEIVER_EMAIL;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = generateOTP();
        await saveOTP(email, otp);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Doctor Login',
            text: `Your OTP is: ${otp}`,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
}

async function verifyOTPController(req, res) {
    try {
        const otp = req.body.otp;
        const email = process.env.RECEIVER_EMAIL;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });

        const isValid = await verifyOTP(email, otp);
        if (!isValid) return res.status(400).json({ message: 'Invalid or expired OTP' });

        req.session.user = { email, role: 'doctor' };
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
}

function patientLogin(req, res) {
    const { secretKey } = req.body;

    if (!secretKey) {
        return res.status(400).json({ message: 'Secret key is required' });
    }

    if (secretKey === process.env.PATIENT_SECRET_KEY) {
        req.session.user = { role: 'patient' };
        return res.status(200).json({ message: 'Patient logged in successfully' });
    }

    res.status(401).json({ message: 'Invalid secret key' });
}

module.exports = { sendOTP, verifyOTPController, patientLogin };
