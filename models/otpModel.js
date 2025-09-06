const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);

async function connectDB() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('MedicalDB').collection('otps');
}

async function saveOTP(phone, otp, expiresInMinutes = 5) {
    const otps = await connectDB();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    await otps.updateOne(
        { phone },
        { $set: { otp, expiresAt } },
        { upsert: true }
    );
}

async function verifyOTP(phone, otp) {
    const otps = await connectDB();
    const record = await otps.findOne({ phone, otp });

    if (!record) return false;
    if (new Date() > record.expiresAt) {
        await otps.deleteOne({ phone, otp });
        return false;
    }

    await otps.deleteOne({ phone, otp });
    return true;
}

module.exports = { saveOTP, verifyOTP };
