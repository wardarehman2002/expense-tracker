// src/components/ExpenseItem.jsx
// A single expense as a clean, grid-aligned row. Click the title or
// amount to edit it inline - no separate form needed.

import { useState } from 'react';

const categoryColors = {
  food: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  transport: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  shopping: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  utilities: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  health: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400',
};

function formatCurrency(amount) {
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function ExpenseItem({ expense, onDelete, onUpdate }) {
  const badgeClasses = categoryColors[expense.category] || categoryColors.other;

  const [editingField, setEditingField] = useState(null); // 'title' | 'amount' | null
  const [draftValue, setDraftValue] = useState('');

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setDraftValue(String(currentValue));
  };

  const cancelEditing = () => {
    setEditingField(null);
    setDraftValue('');
  };

  const commitEdit = () => {
    if (editingField === 'title') {
      const trimmed = draftValue.trim();
      if (trimmed && trimmed !== expense.title) {
        onUpdate(expense.id, { title: trimmed });
      }
    } else if (editingField === 'amount') {
      const numericValue = Number(draftValue);
      if (draftValue !== '' && numericValue > 0 && numericValue !== expense.amount) {
        onUpdate(expense.id, { amount: numericValue });
      }
    }
    cancelEditing();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEditing();
  };

  return (
    <div className="grid grid-cols-[1fr,auto] sm:grid-cols-[2fr,120px,110px,140px,auto] items-center gap-3 sm:gap-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl px-4 py-3.5 hover:border-primary/30 dark:hover:border-primary/40 transition-colors">
      {/* Title + description */}
      <div className="min-w-0 col-span-2 sm:col-span-1 order-1">
        {editingField === 'title' ? (
          <input
            autoFocus
            type="text"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="font-medium text-ink dark:text-white bg-canvas dark:bg-canvas-dark border border-primary/40 rounded-md px-2 py-1 text-sm w-full focus:outline-none"
          />
        ) : (
          <p
            onClick={() => startEditing('title', expense.title)}
            title="Click to edit"
            className="font-medium text-ink dark:text-white truncate cursor-text hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {expense.title}
          </p>
        )}
        {expense.description && (
          <p className="text-xs text-ink-dim dark:text-gray-500 truncate mt-0.5">{expense.description}</p>
        )}
      </div>

      {/* Category badge */}
      <div className="order-3 sm:order-2">
        <span className={`${badgeClasses} text-xs font-medium px-2.5 py-1 rounded-md capitalize inline-block`}>
          {expense.category}
        </span>
      </div>

      {/* Date */}
      <div className="order-4 sm:order-3">
        <span className="text-xs text-ink-dim dark:text-gray-500">{formatDate(expense.date)}</span>
      </div>

      {/* Amount */}
      <div className="order-2 sm:order-4 text-right sm:text-left">
        {editingField === 'amount' ? (
          <input
            autoFocus
            type="number"
            min="1"
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="font-semibold text-primary dark:text-primary-light bg-canvas dark:bg-canvas-dark border border-primary/40 rounded-md px-2 py-1 text-sm w-24 text-right focus:outline-none"
          />
        ) : (
          <span
            onClick={() => startEditing('amount', expense.amount)}
            title="Click to edit"
            className="font-semibold text-ink dark:text-white cursor-text hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {formatCurrency(expense.amount)}
          </span>
        )}
      </div>

      {/* Delete */}
      <div className="order-5 sm:order-5 justify-self-end">
        <button
          type="button"
          onClick={() => onDelete(expense.id)}
          className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-md px-2.5 py-1.5 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default ExpenseItem;
