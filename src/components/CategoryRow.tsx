import { useRef, useState } from 'react'
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

const SWIPE_DELETE_THRESHOLD = 72

function isInteractiveTarget(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && target.closest('button, input, a') !== null
}

export function CategoryRow({ monthId, category, onDelete }: CategoryRowProps) {
  const setCategoryAmount = useBudgetStore((state) => state.setCategoryAmount)
  const [dragX, setDragX] = useState(0)
  const [isEditingAmount, setIsEditingAmount] = useState(false)
  const startX = useRef<number | null>(null)

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // Let the delete button and amount button handle their own pointer/click
    // interactions instead of starting a row-level swipe over them.
    if (isInteractiveTarget(event.target)) return
    startX.current = event.clientX
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (startX.current === null) return
    setDragX(Math.min(0, event.clientX - startX.current))
  }

  function handlePointerUp() {
    if (dragX <= -SWIPE_DELETE_THRESHOLD) {
      onDelete(category)
    }
    setDragX(0)
    startX.current = null
  }

  return (
    <li className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 flex items-center justify-end bg-red-600 px-4 text-sm font-medium text-white">
        Удалить
      </div>
      <div
        className="relative flex items-center gap-3 rounded-xl bg-white px-4 py-3 dark:bg-slate-900"
        style={{ transform: `translateX(${dragX}px)`, touchAction: 'pan-y' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
              {category.name}
            </p>
            <button
              type="button"
              onClick={() => setIsEditingAmount(true)}
              aria-label={`Изменить сумму категории ${category.name}`}
              className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {currencyFormatter.format(category.amount)}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label={`Удалить категорию ${category.name}`}
          onClick={() => onDelete(category)}
          className="shrink-0 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-slate-800"
        >
          ✕
        </button>
      </div>

      {isEditingAmount && (
        <AmountEditDialog
          categoryName={category.name}
          value={category.amount}
          sliderMax={category.sliderMax}
          onChange={(amount) => setCategoryAmount(monthId, category.id, amount)}
          onClose={() => setIsEditingAmount(false)}
        />
      )}
    </li>
  )
}
