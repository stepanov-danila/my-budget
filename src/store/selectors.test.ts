import { describe, expect, it } from 'vitest'
import type { Month } from '../types'
import { computeMonthTotals } from './selectors'

function makeMonth(overrides: Partial<Month> = {}): Month {
  return {
    id: '2026-08',
    label: 'Август 2026',
    categories: [],
    ...overrides,
  }
}

describe('computeMonthTotals', () => {
  it('returns zeros for an undefined month', () => {
    expect(computeMonthTotals(undefined)).toEqual({ income: 0, expense: 0, difference: 0 })
  })

  it('sums income and expense categories separately', () => {
    const month = makeMonth({
      categories: [
        { id: '1', type: 'income', name: 'Зарплата', amount: 85000, sliderMax: 100000 },
        { id: '2', type: 'expense', name: 'Продукты', amount: 12400, sliderMax: 50000 },
        { id: '3', type: 'expense', name: 'Транспорт', amount: 3200, sliderMax: 50000 },
      ],
    })

    expect(computeMonthTotals(month)).toEqual({
      income: 85000,
      expense: 15600,
      difference: 69400,
    })
  })
})
