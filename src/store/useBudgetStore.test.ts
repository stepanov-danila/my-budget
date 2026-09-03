import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../lib/storage'
import { useBudgetStore } from './useBudgetStore'

beforeEach(() => {
  localStorage.clear()
  const { months } = useBudgetStore.getState()
  useBudgetStore.setState({
    theme: 'light',
    activeMonthId: months[0]?.id ?? null,
    months: months.length > 0 ? [{ ...months[0], categories: [] }] : [],
  })
})

describe('useBudgetStore', () => {
  it('starts with a single active month', () => {
    const state = useBudgetStore.getState()
    expect(state.months).toHaveLength(1)
    expect(state.activeMonthId).toBe(state.months[0].id)
  })

  it('reads and updates theme through the store', () => {
    useBudgetStore.getState().setTheme('dark')
    expect(useBudgetStore.getState().theme).toBe('dark')

    useBudgetStore.getState().toggleTheme()
    expect(useBudgetStore.getState().theme).toBe('light')
  })

  it('adds a category to the active month, appended, and persists the change', () => {
    const monthId = useBudgetStore.getState().activeMonthId!
    useBudgetStore.getState().addCategory(monthId, 'expense', 'Продукты')

    const month = useBudgetStore.getState().months.find((m) => m.id === monthId)!
    expect(month.categories).toHaveLength(1)
    expect(month.categories[0].name).toBe('Продукты')
    expect(month.categories[0].amount).toBe(0)

    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('appends new categories after existing ones and never reorders by amount', () => {
    const monthId = useBudgetStore.getState().activeMonthId!
    const store = useBudgetStore.getState()
    store.addCategory(monthId, 'expense', 'Продукты')
    store.addCategory(monthId, 'expense', 'Транспорт')

    const [first, second] = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories
    useBudgetStore.getState().setCategoryAmount(monthId, second.id, 5000)

    const afterAmountChange = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories
    expect(afterAmountChange[0].id).toBe(first.id)
    expect(afterAmountChange[1].id).toBe(second.id)
    expect(afterAmountChange[1].amount).toBe(5000)

    useBudgetStore.getState().addCategory(monthId, 'expense', 'Ипотека')
    const afterAdd = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories
    expect(afterAdd.map((c) => c.name)).toEqual(['Продукты', 'Транспорт', 'Ипотека'])
  })

  it('restores a removed category to its original position on Undo', () => {
    const monthId = useBudgetStore.getState().activeMonthId!
    const store = useBudgetStore.getState()
    store.addCategory(monthId, 'expense', 'Продукты')
    store.addCategory(monthId, 'expense', 'Транспорт')
    store.addCategory(monthId, 'expense', 'Ипотека')

    const [, transport] = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories

    const removed = useBudgetStore.getState().removeCategory(monthId, transport.id)
    expect(removed).not.toBeNull()
    expect(removed!.category.id).toBe(transport.id)
    expect(removed!.index).toBe(1)

    const afterRemoval = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories
    expect(afterRemoval.map((c) => c.name)).toEqual(['Продукты', 'Ипотека'])

    useBudgetStore.getState().restoreCategory(monthId, removed!.category, removed!.index)

    const afterRestore = useBudgetStore
      .getState()
      .months.find((m) => m.id === monthId)!.categories
    expect(afterRestore.map((c) => c.name)).toEqual(['Продукты', 'Транспорт', 'Ипотека'])
  })

  it('grows a category slider max only when the amount exactly matches it', () => {
    const monthId = useBudgetStore.getState().activeMonthId!
    useBudgetStore.getState().addCategory(monthId, 'expense', 'Продукты')
    const categoryId = useBudgetStore.getState().months[0].categories[0].id

    useBudgetStore.getState().setCategoryAmount(monthId, categoryId, 52000)
    expect(useBudgetStore.getState().months[0].categories[0].sliderMax).toBe(50000)
    expect(useBudgetStore.getState().months[0].categories[0].amount).toBe(52000)

    useBudgetStore.getState().setCategoryAmount(monthId, categoryId, 50000)
    expect(useBudgetStore.getState().months[0].categories[0].sliderMax).toBe(100000)
  })
})
