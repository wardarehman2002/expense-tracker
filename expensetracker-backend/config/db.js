// config/db.js
// Connects to MongoDB using the connection string from .env (MONGO_URI).
// Called once, at server startup, before the app starts listening.

const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
