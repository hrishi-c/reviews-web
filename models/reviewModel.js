const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_DB_URI);
const dbName = 'MedicalDB';
let reviewsCollection;

async function connectDB() {
    if (!reviewsCollection) {
        await client.connect();
        const db = client.db(dbName);
        reviewsCollection = db.collection('reviews');
        console.log('Connected to MongoDB');
    }
    return reviewsCollection;
}

async function getAllReviews() {
    const collection = await connectDB();
    return await collection.find({}).toArray();
}

async function addReview(reviewData) {
    const collection = await connectDB();
    return await collection.insertOne(reviewData);
}

module.exports = { getAllReviews, addReview };
