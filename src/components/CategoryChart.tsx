import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Category } from '../types'

interface CategoryChartProps {
  categories: Category[]
}

const COLORS = [
  '#2563eb',
  '#7c3aed',
  '#db2777',
  '#dc2626',
  '#ea580c',
  '#d97706',
  '#65a30d',
  '#059669',
  '#0891b2',
  '#4f46e5',
  '#9333ea',
  '#be185d',
]

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function CategoryChart({ categories }: CategoryChartProps) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0)

  if (categories.length === 0 || total === 0) {
    return (
      <div
        data-testid="category-chart-empty"
        className="mx-4 flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400"
      >
        Добавьте суммы по категориям, чтобы увидеть диаграмму
      </div>
    )
  }

  const data = categories.map((category) => ({
    name: category.name,
    value: category.amount,
  }))

  return (
    <div data-testid="category-chart" className="mx-4 h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="55%"
            outerRadius="85%"
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
