import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'
import { AddMonthMenu } from './AddMonthMenu'
import { ConfirmDialog } from './ConfirmDialog'

export function MonthTabs() {
  const months = useBudgetStore((state) => state.months)
  const activeMonthId = useBudgetStore((state) => state.activeMonthId)
  const setActiveMonth = useBudgetStore((state) => state.setActiveMonth)
  const deleteMonth = useBudgetStore((state) => state.deleteMonth)

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const pendingDeleteMonth = months.find((month) => month.id === pendingDeleteId) ?? null

  return (
    <nav
      className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 px-3 py-2 dark:border-slate-700"
      aria-label="Месяцы"
    >
      <ul className="flex shrink-0 gap-2">
        {months.map((month) => {
          const isActive = month.id === activeMonthId
          return (
            <li key={month.id}>
              <div
                className={`flex items-center rounded-full border pl-1 ${
                  isActive
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveMonth(month.id)}
                  aria-current={isActive ? 'true' : undefined}
                  className="px-3 py-1.5 text-sm font-medium whitespace-nowrap"
                >
                  {month.label}
                </button>
                {months.length > 1 && (
                  <button
                    type="button"
                    aria-label={`Удалить ${month.label}`}
                    onClick={() => setPendingDeleteId(month.id)}
                    className="mr-1 rounded-full px-2 py-1 text-xs opacity-70 hover:opacity-100"
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <AddMonthMenu />

      {pendingDeleteMonth && (
        <ConfirmDialog
          title={`Удалить ${pendingDeleteMonth.label}?`}
          description="Все категории и суммы этого месяца будут удалены без возможности отмены."
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          onConfirm={() => {
            deleteMonth(pendingDeleteMonth.id)
            setPendingDeleteId(null)
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </nav>
  )
}
