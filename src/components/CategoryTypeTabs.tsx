import { Segmented } from 'antd'
import type { CategoryType } from '../types'

interface CategoryTypeTabsProps {
  value: CategoryType
  onChange: (type: CategoryType) => void
}

const OPTIONS: { label: string; value: CategoryType }[] = [
  { label: 'Расходы', value: 'expense' },
  { label: 'Доходы', value: 'income' },
]

export function CategoryTypeTabs({ value, onChange }: CategoryTypeTabsProps) {
  return (
    <Segmented
      value={value}
      onChange={(next) => onChange(next as CategoryType)}
      options={OPTIONS}
      style={{ margin: '12px 16px 0' }}
    />
  )
}
