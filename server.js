const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToDatabase();

const db = client.db('MedicalDB');
const reviewsCollection = db.collection('reviews');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/feedback', (req, res) => {
    res.render('feedback');
});

app.get('/reviews', async (req, res) => {
    try {
        let reviews = await reviewsCollection.find({}).toArray();
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
        res.render('reviews', { reviews, sort: sortValue });
    } catch (error) {
        console.error('Error getting reviews:', error);
        res.status(500).json({ message: 'Failed to get reviews' });
    }
});

app.post('/api/reviews', async (req, res) => {
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
            date: new Date()
        };

        await reviewsCollection.insertOne(newReview);
        res.status(201).json({ message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Failed to submit review' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

