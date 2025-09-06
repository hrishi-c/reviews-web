const reviewModel = require('../models/reviewModel');

async function renderHome(req, res) {
    res.render('index');
}

async function renderFeedback(req, res) {
    res.render('feedback');
}

async function getReviews(req, res) {
    try {
        let reviews = await reviewModel.getAllReviews();
        const sortValue = req.query.sort || 'desc';

        if (sortValue === 'asc') {
            reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortValue === 'rating_desc') {
            reviews.sort((a, b) => b.rating - a.rating);
        } else if (sortValue === 'rating_asc') {
            reviews.sort((a, b) => a.rating - b.rating);
        } else {
            reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        res.render('reviews', {
            reviews,
            sort: sortValue,
            user: req.session.user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to get reviews');
    }
}

async function postReview(req, res) {
    try {
        const { name, phone, review, rating } = req.body;

        if (!name || !phone || !review || !rating) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const newReview = {
            name,
            phone,
            review,
            rating,
            date: new Date(),
        };

        await reviewModel.addReview(newReview);
        res.status(201).json({ message: 'Review submitted successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to submit review' });
    }
}

module.exports = {
    renderHome,
    renderFeedback,
    getReviews,
    postReview
};
