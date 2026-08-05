// src/components/FilterBar.jsx
// Category + search + amount range filters. Purely controlled by props -
// all filter state lives in App.jsx.

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl p-4 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Search title</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            placeholder="e.g. grocery"
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Min amount</label>
          <input
            type="number"
            min="0"
            value={filters.minAmount}
            onChange={(e) => onFilterChange('minAmount', e.target.value)}
            placeholder="0"
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-ink-dim dark:text-gray-400">Max amount</label>
          <input
            type="number"
            min="0"
            value={filters.maxAmount}
            onChange={(e) => onFilterChange('maxAmount', e.target.value)}
            placeholder="Any"
            className="bg-canvas dark:bg-canvas-dark border border-border dark:border-border-dark rounded-lg px-3 py-2 text-sm text-ink dark:text-white placeholder:text-ink-dim/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
