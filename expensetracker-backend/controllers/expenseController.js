// controllers/expenseController.js
// All business logic for the /api/expenses resource lives here.
// Controllers never touch fs directly - they go through fileHelper.js.

const { readExpenses, writeExpenses } = require('../utils/fileHelper');

const VALID_CATEGORIES = ['food', 'transport', 'shopping', 'utilities', 'health', 'other'];

/**
 * GET /api/expenses
 * Supports combinable query filters: category, search, minAmount, maxAmount
 */
function getAllExpenses(req, res) {
  const { category, search, minAmount, maxAmount } = req.query;
  let expenses = readExpenses();

  if (category) {
    expenses = expenses.filter((expense) => expense.category === category);
  }

  if (search) {
    const searchTerm = search.toLowerCase();
    expenses = expenses.filter((expense) => expense.title.toLowerCase().includes(searchTerm));
  }

  if (minAmount) {
    const min = Number(minAmount);
    expenses = expenses.filter((expense) => expense.amount >= min);
  }

  if (maxAmount) {
    const max = Number(maxAmount);
    expenses = expenses.filter((expense) => expense.amount <= max);
  }

  res.json({ success: true, count: expenses.length, data: expenses });
}

/**
 * GET /api/expenses/stats
 * IMPORTANT: this route must be registered BEFORE /:id in expenseRoutes.js
 * or Express will try to parse "stats" as an id.
 */
function getStats(req, res) {
  const expenses = readExpenses();

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
    data: {
      totalExpenses,
      totalAmount,
      byCategory,
      highestExpense,
      lowestExpense,
    },
  });
}

/**
 * GET /api/expenses/:id
 */
function getExpenseById(req, res) {
  const expenseId = parseInt(req.params.id, 10);
  const expenses = readExpenses();
  const expense = expenses.find((item) => item.id === expenseId);

  if (!expense) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }

  res.json({ success: true, data: expense });
}

/**
 * POST /api/expenses
 * Required fields (title, amount, category) are already guaranteed present
 * by the validate middleware before this controller runs.
 */
function createExpense(req, res) {
  const { title, amount, category, description, date } = req.body;

  if (!VALID_CATEGORIES.includes(category)) {
    return res.status(400).json({
      success: false,
      message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
    });
  }

  const expenses = readExpenses();

  const newExpense = {
    id: Date.now(),
    title,
    amount: Number(amount),
    category,
    date: date || new Date().toISOString().split('T')[0],
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  res.status(201).json({ success: true, data: newExpense });
}

/**
 * PUT /api/expenses/:id
 * Partial update - only the fields present in req.body are changed.
 * id and createdAt can never be overwritten.
 */
function updateExpense(req, res) {
  const expenseId = parseInt(req.params.id, 10);
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((item) => item.id === expenseId);

  if (expenseIndex === -1) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }

  const { id, createdAt, ...updatableFields } = req.body;

  const updatedExpense = {
    ...expenses[expenseIndex],
    ...updatableFields,
    id: expenses[expenseIndex].id,
    createdAt: expenses[expenseIndex].createdAt,
  };

  if (updatableFields.amount !== undefined) {
    updatedExpense.amount = Number(updatableFields.amount);
  }

  expenses[expenseIndex] = updatedExpense;
  writeExpenses(expenses);

  res.json({ success: true, data: updatedExpense });
}

/**
 * DELETE /api/expenses/:id
 */
function deleteExpense(req, res) {
  const expenseId = parseInt(req.params.id, 10);
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((item) => item.id === expenseId);

  if (expenseIndex === -1) {
    return res.status(404).json({ success: false, message: 'Expense not found' });
  }

  expenses.splice(expenseIndex, 1);
  writeExpenses(expenses);

  res.json({ success: true, message: 'Expense deleted successfully' });
}

/**
 * GET /api/expenses/export (bonus)
 * Streams the expenses as a downloadable CSV file, built using only the fs
 * module's in-memory data (no extra CSV library).
 */
function exportExpensesCsv(req, res) {
  const expenses = readExpenses();
  const headers = ['id', 'title', 'amount', 'category', 'date', 'description', 'createdAt'];

  const escapeCsvValue = (value) => {
    const stringValue = String(value ?? '');
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const rows = expenses.map((expense) => headers.map((key) => escapeCsvValue(expense[key])).join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csvContent);
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
