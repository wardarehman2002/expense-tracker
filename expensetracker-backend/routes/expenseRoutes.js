// routes/expenseRoutes.js
// Defines all /api/expenses routes and wires them to controller functions.
// NOTE: /stats is intentionally defined BEFORE /:id - otherwise Express
// would treat "stats" as an :id value and getExpenseById would run instead.

const express = require('express');
const router = express.Router();

const {
  getAllExpenses,
  getStats,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  exportExpensesCsv,
} = require('../controllers/expenseController');

const validate = require('../middleware/validate');

router.get('/stats', getStats);
router.get('/export', exportExpensesCsv);

router.get('/', getAllExpenses);
router.get('/:id', getExpenseById);

router.post('/', validate('title', 'amount', 'category'), createExpense);

router.put('/:id', updateExpense);

router.delete('/:id', deleteExpense);

module.exports = router;
