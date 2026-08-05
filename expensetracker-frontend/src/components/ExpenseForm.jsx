// src/components/ExpenseForm.jsx
// Controlled form to add a new expense entry.

import { useState } from 'react';

const CATEGORY_OPTIONS = ['food', 'transport', 'shopping', 'utilities', 'health', 'other'];

const today = () => new Date().toISOString().split('T')[0];

const emptyForm = {
  title: '',
  amount: '',
  category: 'food',
  date: today(),
  description: '',
};

function ExpenseForm({ onCreate }) {
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.amount) {
      setFormError('Title and amount are required.');
      return;
    }

    if (Number(formData.amount) <= 0) {
      setFormError('Amount must be greater than zero.');
      return;
    }

    setFormError('');
    onCreate(formData);
    setFormData({ ...emptyForm, date: today() });
  };

  return (
    <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border dark:border-border-dark">
        <h2 className="font-display font-bold text-ink dark:text-white">Add expense</h2>
        <p className="text-xs text-ink-dim dark:text-gray-500 mt-0.5">Record a new transaction</p>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {formError && (
          <p className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm rounded-lg px-3 py-2">
            {formError}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Grocery shopping"
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Amount (PKR)</label>
            <input
              type="number"
              min="1"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0"
              className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary [color-scheme:light] dark:[color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">
            Description <span className="text-ink-dim/60">(optional)</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Any extra detail..."
            rows={2}
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>

        <button
          type="submit"
          className="mt-1 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
