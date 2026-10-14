import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { theme as antdTheme, Typography } from 'antd'
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
  const { token } = antdTheme.useToken()
  const total = categories.reduce((sum, category) => sum + category.amount, 0)

  if (categories.length === 0 || total === 0) {
    return (
      <div
        data-testid="category-chart-empty"
        style={{
          margin: '0 16px',
          height: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 16px',
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
        }}
      >
        <Typography.Text type="secondary">
          Добавьте суммы по категориям, чтобы увидеть диаграмму
        </Typography.Text>
      </div>
    )
  }

  const data = categories.map((category) => ({
    name: category.name,
    value: category.amount,
  }))

  return (
    <div data-testid="category-chart" style={{ margin: '0 16px', height: 208 }}>
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
