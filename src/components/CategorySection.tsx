import { useEffect, useRef, useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import type { Category, CategoryType } from '../types'
import { AddCategoryMenu } from './AddCategoryMenu'
import { CategoryChart } from './CategoryChart'
import { CategoryRow } from './CategoryRow'
import { CategoryTypeTabs } from './CategoryTypeTabs'
import { UndoToast } from './UndoToast'

const UNDO_WINDOW_MS = 5000

interface PendingUndo {
  monthId: string
  category: Category
}

export function CategorySection() {
  const activeMonthId = useBudgetStore((state) => state.activeMonthId)
  const categories = useBudgetStore(
    (state) =>
      state.months.find((month) => month.id === state.activeMonthId)?.categories ?? [],
  )
  const removeCategory = useBudgetStore((state) => state.removeCategory)
  const restoreCategory = useBudgetStore((state) => state.restoreCategory)

  const [activeType, setActiveType] = useState<CategoryType>('expense')
  const [pendingUndo, setPendingUndo] = useState<PendingUndo | null>(null)
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (undoTimer.current) clearTimeout(undoTimer.current)
    },
    [],
  )

  if (!activeMonthId) return null

  const visibleCategories = categories.filter((category) => category.type === activeType)

  function handleDelete(category: Category) {
    if (!activeMonthId) return
    removeCategory(activeMonthId, category.id)
    setPendingUndo({ monthId: activeMonthId, category })

    if (undoTimer.current) clearTimeout(undoTimer.current)
    undoTimer.current = setTimeout(() => {
      setPendingUndo(null)
    }, UNDO_WINDOW_MS)
  }

  function handleUndo() {
    if (!pendingUndo) return
    if (undoTimer.current) clearTimeout(undoTimer.current)
    restoreCategory(pendingUndo.monthId, pendingUndo.category)
    setPendingUndo(null)
  }

  return (
    <div className="pb-24">
      <CategoryTypeTabs value={activeType} onChange={setActiveType} />

      <div className="mt-3">
        <CategoryChart categories={visibleCategories} />
      </div>

      <AddCategoryMenu
        monthId={activeMonthId}
        type={activeType}
        existingNames={categories
          .filter((category) => category.type === activeType)
          .map((category) => category.name)}
      />

      {visibleCategories.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Пока нет категорий. Добавьте первую выше.
        </p>
      ) : (
        <ul aria-label="Список категорий" className="mt-3 space-y-2 px-4">
          {visibleCategories.map((category) => (
            <CategoryRow
              key={category.id}
              monthId={activeMonthId}
              category={category}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}

      {pendingUndo && (
        <UndoToast
          message={`Категория «${pendingUndo.category.name}» удалена`}
          onUndo={handleUndo}
        />
      )}
    </div>
  )
}
