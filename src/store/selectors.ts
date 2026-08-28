import type { Month } from '../types'

export interface MonthTotals {
  income: number
  expense: number
  difference: number
}

export function computeMonthTotals(month: Month | undefined): MonthTotals {
  if (!month) return { income: 0, expense: 0, difference: 0 }

  const income = month.categories
    .filter((category) => category.type === 'income')
    .reduce((sum, category) => sum + category.amount, 0)
  const expense = month.categories
    .filter((category) => category.type === 'expense')
    .reduce((sum, category) => sum + category.amount, 0)

  return { income, expense, difference: income - expense }
}
