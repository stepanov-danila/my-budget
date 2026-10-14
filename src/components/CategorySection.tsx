import { App as AntdApp, Button, List } from 'antd'
import { useRef, useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import type { Category, CategoryType } from '../types'
import { AddCategoryMenu } from './AddCategoryMenu'
import { CategoryChart } from './CategoryChart'
import { CategoryRow } from './CategoryRow'
import { CategoryTypeTabs } from './CategoryTypeTabs'

const UNDO_WINDOW_MS = 5000
const UNDO_NOTIFICATION_KEY = 'category-undo'

interface PendingUndo {
  monthId: string
  category: Category
  index: number
}

export function CategorySection() {
  const { notification } = AntdApp.useApp()
  const activeMonthId = useBudgetStore((state) => state.activeMonthId)
  const categories = useBudgetStore(
    (state) =>
      state.months.find((month) => month.id === state.activeMonthId)?.categories ?? [],
  )
  const removeCategory = useBudgetStore((state) => state.removeCategory)
  const restoreCategory = useBudgetStore((state) => state.restoreCategory)

  const [activeType, setActiveType] = useState<CategoryType>('expense')
  const pendingUndoRef = useRef<PendingUndo | null>(null)

  if (!activeMonthId) return null

  const visibleCategories = categories.filter((category) => category.type === activeType)

  function handleUndo(pending: PendingUndo) {
    restoreCategory(pending.monthId, pending.category, pending.index)
    pendingUndoRef.current = null
    notification.destroy(UNDO_NOTIFICATION_KEY)
  }

  function handleDelete(category: Category) {
    if (!activeMonthId) return
    const removed = removeCategory(activeMonthId, category.id)
    if (!removed) return

    const pending: PendingUndo = {
      monthId: activeMonthId,
      category: removed.category,
      index: removed.index,
    }
    pendingUndoRef.current = pending

    notification.open({
      key: UNDO_NOTIFICATION_KEY,
      message: `Категория «${removed.category.name}» удалена`,
      duration: UNDO_WINDOW_MS / 1000,
      placement: 'bottom',
      btn: (
        <Button type="link" size="small" onClick={() => handleUndo(pending)}>
          Отменить
        </Button>
      ),
      onClose: () => {
        pendingUndoRef.current = null
      },
    })
  }

  return (
    <div style={{ paddingBottom: 96 }}>
      <CategoryTypeTabs value={activeType} onChange={setActiveType} />

      <div style={{ marginTop: 12 }}>
        <CategoryChart categories={visibleCategories} />
      </div>

      <AddCategoryMenu
        monthId={activeMonthId}
        type={activeType}
        existingNames={categories
          .filter((category) => category.type === activeType)
          .map((category) => category.name)}
      />

      <List
        aria-label="Список категорий"
        style={{ marginTop: 12, padding: '0 16px' }}
        dataSource={visibleCategories}
        locale={{ emptyText: 'Пока нет категорий. Добавьте первую выше.' }}
        renderItem={(category) => (
          <CategoryRow
            key={category.id}
            monthId={activeMonthId}
            category={category}
            onDelete={handleDelete}
          />
        )}
      />
    </div>
  )
}
