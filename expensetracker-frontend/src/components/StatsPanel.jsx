// src/components/StatsPanel.jsx
// Clean, clearly-labelled summary cards: total spent, entry count, top
// category, and a per-category breakdown list.

const categoryColors = {
  food: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  transport: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  shopping: 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
  utilities: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  health: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400',
};

function formatCurrency(amount) {
  return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
}

function StatsPanel({ stats }) {
  if (!stats) return null;

  const { totalExpenses, totalAmount, byCategory, highestExpense } = stats;
  const categoryEntries = Object.entries(byCategory || {}).sort((a, b) => b[1].total - a[1].total);
  const topCategory = categoryEntries[0]?.[0];

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-dim dark:text-gray-500 mb-3">
        Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* Total spent */}
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-5 shadow-card">
          <p className="text-sm text-ink-dim dark:text-gray-400 mb-1">Total spent</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-white">
            {formatCurrency(totalAmount)}
          </p>
        </div>

        {/* Total entries */}
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-5 shadow-card">
          <p className="text-sm text-ink-dim dark:text-gray-400 mb-1">Total entries</p>
          <p className="font-display text-2xl font-bold text-ink dark:text-white">
            {totalExpenses}
          </p>
        </div>

        {/* Highest expense */}
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-5 shadow-card">
          <p className="text-sm text-ink-dim dark:text-gray-400 mb-1">Highest expense</p>
          {highestExpense ? (
            <>
              <p className="font-display text-2xl font-bold text-ink dark:text-white">
                {formatCurrency(highestExpense.amount)}
              </p>
              <p className="text-xs text-ink-dim dark:text-gray-500 truncate mt-0.5">
                {highestExpense.title}
              </p>
            </>
          ) : (
            <p className="font-display text-2xl font-bold text-ink-dim dark:text-gray-600">—</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      {categoryEntries.length > 0 && (
        <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-5 shadow-card">
          <p className="text-sm font-medium text-ink dark:text-white mb-3">By category</p>
          <div className="flex flex-col divide-y divide-border dark:divide-border-dark">
            {categoryEntries.map(([category, data]) => (
              <div key={category} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`${categoryColors[category] || categoryColors.other} text-xs font-medium px-2.5 py-1 rounded-md capitalize`}
                  >
                    {category}
                  </span>
                  <span className="text-xs text-ink-dim dark:text-gray-500">
                    {data.count} {data.count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <span className="text-sm font-semibold text-ink dark:text-white">
                  {formatCurrency(data.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
