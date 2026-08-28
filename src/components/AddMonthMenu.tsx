import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'

export function AddMonthMenu() {
  const [open, setOpen] = useState(false)
  const addMonth = useBudgetStore((state) => state.addMonth)
  const hasMonths = useBudgetStore((state) => state.months.length > 0)

  function handleAdd(mode: 'empty' | 'carry-over') {
    addMonth(mode)
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Добавить месяц"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 text-lg leading-none text-slate-700 dark:border-slate-600 dark:text-slate-200"
      >
        +
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <div
            role="menu"
            aria-label="Новый месяц"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Новый месяц
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleAdd('empty')}
                className="rounded-lg border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Начать с пустого месяца
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!hasMonths}
                onClick={() => handleAdd('carry-over')}
                className="rounded-lg border border-slate-300 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                Перенести категории и суммы из предыдущего месяца
              </button>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </>
  )
}
