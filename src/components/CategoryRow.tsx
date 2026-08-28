import { useRef, useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import type { Category } from '../types'
import { AmountInput } from './AmountInput'

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

export function CategoryRow({ monthId, category, onDelete }: CategoryRowProps) {
  const setCategoryAmount = useBudgetStore((state) => state.setCategoryAmount)
  const [dragX, setDragX] = useState(0)
  const startX = useRef<number | null>(null)

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
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
            <p className="shrink-0 text-sm font-semibold text-slate-700 dark:text-slate-200">
              {currencyFormatter.format(category.amount)}
            </p>
          </div>
          <div className="mt-2">
            <AmountInput
              value={category.amount}
              sliderMax={category.sliderMax}
              onChange={(amount) => setCategoryAmount(monthId, category.id, amount)}
            />
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
    </li>
  )
}
