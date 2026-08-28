import { create } from 'zustand'
import { loadState, saveState } from '../lib/storage'
import type { AppState, Category, CategoryType, Month, Theme } from '../types'

const DEFAULT_SLIDER_MAX = 50_000
const SLIDER_STEP = 50_000

/** Next slider ceiling strictly above `amount`, per design.md's adaptive-slider decision. */
function nextSliderMax(amount: number): number {
  return Math.ceil((amount + 1) / SLIDER_STEP) * SLIDER_STEP
}

function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => b.amount - a.amount)
}

function monthLabel(date: Date): string {
  const label = date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

function createMonthId(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function createEmptyMonth(date: Date = new Date()): Month {
  return {
    id: createMonthId(date),
    label: monthLabel(date),
    categories: [],
  }
}

function detectPreferredTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function loadInitialState(): AppState {
  const stored = loadState()
  if (stored && stored.months.length > 0) return stored

  const firstMonth = createEmptyMonth()
  return {
    theme: detectPreferredTheme(),
    activeMonthId: firstMonth.id,
    months: [firstMonth],
  }
}

function withMonth(months: Month[], monthId: string, update: (month: Month) => Month): Month[] {
  return months.map((month) => (month.id === monthId ? update(month) : month))
}

interface BudgetActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setActiveMonth: (monthId: string) => void
  addMonth: (mode: 'empty' | 'carry-over') => void
  deleteMonth: (monthId: string) => void
  addCategory: (monthId: string, type: CategoryType, name: string) => void
  removeCategory: (monthId: string, categoryId: string) => Category | null
  restoreCategory: (monthId: string, category: Category) => void
  setCategoryAmount: (monthId: string, categoryId: string, amount: number) => void
  growCategorySliderMax: (monthId: string, categoryId: string) => void
}

export type BudgetStore = AppState & BudgetActions

export const useBudgetStore = create<BudgetStore>()((set, get) => ({
  ...loadInitialState(),

  setTheme: (theme) => set({ theme }),

  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  setActiveMonth: (monthId) => set({ activeMonthId: monthId }),

  addMonth: (mode) => {
    const { months, activeMonthId } = get()
    const newMonth = createEmptyMonth()

    if (mode === 'carry-over') {
      const previous = months.find((month) => month.id === activeMonthId) ?? months[0]
      if (previous) {
        newMonth.categories = previous.categories.map((category) => ({
          ...category,
          id: crypto.randomUUID(),
        }))
      }
    }

    set((state) => ({
      months: [...state.months, newMonth],
      activeMonthId: newMonth.id,
    }))
  },

  deleteMonth: (monthId) => {
    set((state) => {
      const months = state.months.filter((month) => month.id !== monthId)
      const activeMonthId =
        state.activeMonthId === monthId ? (months[0]?.id ?? null) : state.activeMonthId
      return { months, activeMonthId }
    })
  },

  addCategory: (monthId, type, name) => {
    set((state) => ({
      months: withMonth(state.months, monthId, (month) => ({
        ...month,
        categories: sortCategories([
          ...month.categories,
          {
            id: crypto.randomUUID(),
            type,
            name,
            amount: 0,
            sliderMax: DEFAULT_SLIDER_MAX,
          },
        ]),
      })),
    }))
  },

  removeCategory: (monthId, categoryId) => {
    const month = get().months.find((m) => m.id === monthId)
    const removed = month?.categories.find((c) => c.id === categoryId) ?? null

    set((state) => ({
      months: withMonth(state.months, monthId, (m) => ({
        ...m,
        categories: m.categories.filter((c) => c.id !== categoryId),
      })),
    }))

    return removed
  },

  restoreCategory: (monthId, category) => {
    set((state) => ({
      months: withMonth(state.months, monthId, (month) => ({
        ...month,
        categories: sortCategories([...month.categories, category]),
      })),
    }))
  },

  setCategoryAmount: (monthId, categoryId, amount) => {
    set((state) => ({
      months: withMonth(state.months, monthId, (month) => ({
        ...month,
        categories: sortCategories(
          month.categories.map((category) =>
            category.id === categoryId
              ? {
                  ...category,
                  amount,
                  sliderMax:
                    amount >= category.sliderMax
                      ? nextSliderMax(amount)
                      : category.sliderMax,
                }
              : category,
          ),
        ),
      })),
    }))
  },

  growCategorySliderMax: (monthId, categoryId) => {
    set((state) => ({
      months: withMonth(state.months, monthId, (month) => ({
        ...month,
        categories: month.categories.map((category) =>
          category.id === categoryId
            ? { ...category, sliderMax: nextSliderMax(category.sliderMax) }
            : category,
        ),
      })),
    }))
  },
}))

useBudgetStore.subscribe((state) => {
  saveState({ theme: state.theme, activeMonthId: state.activeMonthId, months: state.months })
})
