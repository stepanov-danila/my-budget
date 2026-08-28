export type CategoryType = 'expense' | 'income'

export type Theme = 'light' | 'dark'

export interface Category {
  id: string
  type: CategoryType
  name: string
  /** Total amount for this category in the owning month, in RUB. */
  amount: number
  /** Current adaptive ceiling of this category's amount slider, in RUB. */
  sliderMax: number
}

export interface Month {
  id: string
  /** Display label, e.g. "Август 2026". */
  label: string
  categories: Category[]
}

export interface AppState {
  theme: Theme
  activeMonthId: string | null
  months: Month[]
}
