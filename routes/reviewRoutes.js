const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { sendOTP, verifyOTPController } = require('../controllers/authController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/home', reviewController.renderHome);

router.get('/feedback', ensureAuthenticated, reviewController.renderFeedback);

router.get('/reviews', reviewController.getReviews);

router.post('/api/reviews', reviewController.postReview);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTPController);

module.exports = router;
