// src/App.jsx
// All application state lives here. Child components are presentational -
// they receive data and callbacks as props.

import { useEffect, useState } from 'react';
import {
  getAllExpenses,
  getStats,
  createExpense,
  updateExpense,
  deleteExpense,
} from './api/expenseApi';
import FilterBar from './components/FilterBar';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import StatsPanel from './components/StatsPanel';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minAmount: '',
    maxAmount: '',
  });

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllExpenses(filters);
      setExpenses(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await getStats();
      setStats(result.data);
    } catch (err) {
      // Stats are secondary - a failure here shouldn't block the main list.
      console.error('Failed to load stats:', err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleCreate = async (formData) => {
    try {
      await createExpense(formData);
      await fetchExpenses();
      await fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, changes) => {
    try {
      await updateExpense(id, changes);
      await fetchExpenses();
      await fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this expense? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteExpense(id);
      await fetchExpenses();
      await fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark font-body transition-colors">
      {/* Top bar */}
      <div className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-display font-bold text-sm">
              Rs
            </div>
            <div>
              <h1 className="font-display font-bold text-ink dark:text-white leading-none">ExpenseTracker</h1>
              <p className="text-xs text-ink-dim dark:text-gray-500 mt-0.5">TechnerLab Bootcamp · MERN Stack</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex items-center gap-2 border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm font-medium text-ink dark:text-white hover:bg-canvas dark:hover:bg-canvas-dark transition-colors"
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Summary */}
        <StatsPanel stats={stats} />

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6 items-start">
          <aside className="lg:sticky lg:top-8">
            <ExpenseForm onCreate={handleCreate} />
          </aside>

          <main className="flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-dim dark:text-gray-500 mb-3">
                Filters
              </h2>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-dim dark:text-gray-500 mb-3">
                Expenses
              </h2>
              <ExpenseList
                expenses={expenses}
                loading={loading}
                error={error}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            </div>
          </main>
        </div>

        <footer className="text-center text-xs text-ink-dim dark:text-gray-600 pt-4">
          Built by Warda · Node.js + Express + fs · React + Tailwind CSS
        </footer>
      </div>
    </div>
  );
}

export default App;
