import { useId, useState } from 'react'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '../constants/categories'
import { useBudgetStore } from '../store/useBudgetStore'
import type { CategoryType } from '../types'

interface AddCategoryMenuProps {
  monthId: string
  type: CategoryType
  existingNames: string[]
}

export function AddCategoryMenu({ monthId, type, existingNames }: AddCategoryMenuProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const addCategory = useBudgetStore((state) => state.addCategory)
  const inputId = useId()

  const defaults = type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES
  const availableDefaults = defaults.filter((defaultName) => !existingNames.includes(defaultName))

  function close() {
    setOpen(false)
    setName('')
  }

  function handleManualSubmit(event: React.FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addCategory(monthId, type, trimmed)
    close()
  }

  function handleSelectDefault(categoryName: string) {
    addCategory(monthId, type, categoryName)
    close()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-4 mt-3 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 dark:border-slate-600 dark:text-slate-300"
      >
        + Добавить категорию
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={close}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Новая категория
            </h2>

            <form onSubmit={handleManualSubmit} className="mt-4 flex gap-2">
              <label htmlFor={inputId} className="sr-only">
                Название категории
              </label>
              <input
                id={inputId}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Своё название"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
              />
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                Добавить
              </button>
            </form>

            {availableDefaults.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                  Или выбрать из списка
                </p>
                <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto">
                  {availableDefaults.map((categoryName) => (
                    <li key={categoryName}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={false}
                        onClick={() => handleSelectDefault(categoryName)}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                      >
                        {categoryName}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="button"
              onClick={close}
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
