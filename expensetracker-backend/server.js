// server.js - Entry point for the ExpenseTracker backend

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const expenseRoutes = require('./routes/expenseRoutes');

connectDB();

const app = express();

// --- Core middleware (order matters) ---
// CORS_ORIGIN can be set in the environment when deploying (e.g. Render)
// so the deployed frontend's URL is allowed. Falls back to local dev.
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(logger);

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/expenses', expenseRoutes);

// --- 404 fallback for unknown routes ---
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// --- Global error handler (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`ExpenseTracker backend running on http://localhost:${PORT}`);
});
