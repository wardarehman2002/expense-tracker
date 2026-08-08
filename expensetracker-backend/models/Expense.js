// models/Expense.js
// Mongoose schema defining the shape of an expense document in MongoDB.
// Replaces the plain JSON objects that used to live in expenses.json.

const mongoose = require('mongoose');

const VALID_CATEGORIES = ['food', 'transport', 'shopping', 'utilities', 'health', 'other'];

const today = () => new Date().toISOString().split('T')[0];

const expenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    category: { type: String, required: true, enum: VALID_CATEGORIES },
    date: { type: String, default: today },
    description: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true, // includes the auto-generated `id` (string version of _id)
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
