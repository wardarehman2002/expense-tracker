// controllers/expenseController.js
// All business logic for the /api/expenses resource lives here.
// Controllers now talk to MongoDB through the Expense model - no fs
// involved anywhere anymore.

const mongoose = require('mongoose');
const Expense = require('../models/Expense');

/**
 * GET /api/expenses
 * Supports combinable query filters: category, search, minAmount, maxAmount
 */
async function getAllExpenses(req, res, next) {
  try {
    const { category, search, minAmount, maxAmount } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = Number(minAmount);
      if (maxAmount) filter.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/expenses/stats
 * IMPORTANT: this route must be registered BEFORE /:id in expenseRoutes.js.
 */
async function getStats(req, res, next) {
  try {
    const expenses = await Expense.find();

    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const byCategory = {};
    expenses.forEach((expense) => {
      if (!byCategory[expense.category]) {
        byCategory[expense.category] = { count: 0, total: 0 };
      }
      byCategory[expense.category].count += 1;
      byCategory[expense.category].total += expense.amount;
    });

    let highestExpense = null;
    let lowestExpense = null;

    expenses.forEach((expense) => {
      if (!highestExpense || expense.amount > highestExpense.amount) {
        highestExpense = { title: expense.title, amount: expense.amount };
      }
      if (!lowestExpense || expense.amount < lowestExpense.amount) {
        lowestExpense = { title: expense.title, amount: expense.amount };
      }
    });

    res.json({
      success: true,
      data: { totalExpenses, totalAmount, byCategory, highestExpense, lowestExpense },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/expenses/:id
 */
async function getExpenseById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/expenses
 * Required fields (title, amount, category) are already guaranteed present
 * by the validate middleware before this controller runs.
 */
async function createExpense(req, res, next) {
  try {
    const { title, amount, category, description, date } = req.body;

    const newExpense = await Expense.create({
      title,
      amount: Number(amount),
      category,
      description,
      date,
    });

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

/**
 * PUT /api/expenses/:id
 * Partial update - only the fields present in req.body are changed.
 * id and createdAt can never be overwritten.
 */
async function updateExpense(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const { id, _id, createdAt, ...updatableFields } = req.body;

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, updatableFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, data: updatedExpense });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
}

/**
 * DELETE /api/expenses/:id
 */
async function deleteExpense(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
    if (!deletedExpense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/expenses/export (bonus)
 * Streams all expenses as a downloadable CSV file.
 */
async function exportExpensesCsv(req, res, next) {
  try {
    const expenses = await Expense.find();
    const headers = ['id', 'title', 'amount', 'category', 'date', 'description', 'createdAt'];

    const escapeCsvValue = (value) => {
      const stringValue = String(value ?? '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const rows = expenses.map((expense) => {
      const plain = expense.toJSON();
      return headers.map((key) => escapeCsvValue(plain[key])).join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
    res.send(csvContent);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllExpenses,
  getStats,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpensesCsv,
};
