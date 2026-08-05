// src/components/ExpenseList.jsx
// Renders the list of ExpenseItem rows with a labelled header, plus
// loading / empty / error states.

import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, loading, error, onDelete, onUpdate }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-ink-dim dark:text-gray-500 gap-3">
        <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm">Loading expenses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 rounded-xl px-5 py-4 text-sm">
        <span className="font-semibold">Couldn't load expenses.</span> {error}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border dark:border-border-dark rounded-xl">
        <p className="font-display font-semibold text-ink dark:text-white">No expenses found</p>
        <p className="text-sm text-ink-dim dark:text-gray-500 mt-1">
          Add your first entry, or clear your filters to see existing ones.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Column header - desktop only */}
      <div className="hidden sm:grid grid-cols-[2fr,120px,110px,140px,auto] gap-4 px-4 text-xs font-semibold uppercase tracking-wider text-ink-dim dark:text-gray-500">
        <span>Description</span>
        <span>Category</span>
        <span>Date</span>
        <span>Amount</span>
        <span></span>
      </div>

      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}

export default ExpenseList;
