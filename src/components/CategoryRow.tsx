import { DeleteOutlined } from '@ant-design/icons'
import { Button, List, Typography } from 'antd'
import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import type { Category } from '../types'
import { AmountEditDialog } from './AmountEditDialog'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

interface CategoryRowProps {
  monthId: string
  category: Category
  onDelete: (category: Category) => void
}

export function CategoryRow({ monthId, category, onDelete }: CategoryRowProps) {
  const setCategoryAmount = useBudgetStore((state) => state.setCategoryAmount)
  const [isEditingAmount, setIsEditingAmount] = useState(false)

  return (
    <List.Item
      actions={[
        <Button
          key="delete"
          type="text"
          danger
          shape="circle"
          aria-label={`Удалить категорию ${category.name}`}
          icon={<DeleteOutlined />}
          onClick={() => onDelete(category)}
        />,
      ]}
    >
      <Typography.Text style={{ flex: 1, minWidth: 0 }} ellipsis>
        {category.name}
      </Typography.Text>
      <Button
        type="text"
        aria-label={`Изменить сумму категории ${category.name}`}
        onClick={() => setIsEditingAmount(true)}
        style={{ fontWeight: 600 }}
      >
        {currencyFormatter.format(category.amount)}
      </Button>

      {isEditingAmount && (
        <AmountEditDialog
          categoryName={category.name}
          value={category.amount}
          sliderMax={category.sliderMax}
          onChange={(amount) => setCategoryAmount(monthId, category.id, amount)}
          onClose={() => setIsEditingAmount(false)}
        />
      )}
    </List.Item>
  )
}
