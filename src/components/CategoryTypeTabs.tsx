import type { CategoryType } from '../types'

interface CategoryTypeTabsProps {
  value: CategoryType
  onChange: (type: CategoryType) => void
}

const TABS: [CategoryType, string][] = [
  ['expense', 'Расходы'],
  ['income', 'Доходы'],
]

export function CategoryTypeTabs({ value, onChange }: CategoryTypeTabsProps) {
  return (
    <div role="tablist" aria-label="Тип категорий" className="flex gap-1 px-4 pt-3">
      {TABS.map(([type, title]) => (
        <button
          key={type}
          type="button"
          role="tab"
          aria-selected={value === type}
          onClick={() => onChange(type)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            value === type
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 dark:text-slate-300'
          }`}
        >
          {title}
        </button>
      ))}
    </div>
  )
}
