import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { useBudgetStore } from '../store/useBudgetStore'

function resetStore() {
  localStorage.clear()
  useBudgetStore.setState({
    theme: 'light',
    activeMonthId: '2026-08',
    months: [{ id: '2026-08', label: 'Август 2026', categories: [] }],
  })
}

beforeEach(() => {
  resetStore()
})

describe('category-management', () => {
  it("shows only the active type's categories (Expense/Income sections)", async () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    useBudgetStore.getState().addCategory('2026-08', 'income', 'Зарплата')

    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('Продукты')).toBeInTheDocument()
    expect(screen.queryByText('Зарплата')).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Доходы' }))

    expect(screen.getByText('Зарплата')).toBeInTheDocument()
    expect(screen.queryByText('Продукты')).not.toBeInTheDocument()
  })

  it('adds a manually named category with a zero starting amount (Manual category creation)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '+ Добавить категорию' }))
    await user.type(screen.getByPlaceholderText('Своё название'), 'Ипотека')
    await user.click(screen.getByRole('button', { name: 'Добавить' }))

    const month = useBudgetStore.getState().months[0]
    expect(month.categories).toHaveLength(1)
    expect(month.categories[0]).toMatchObject({
      name: 'Ипотека',
      amount: 0,
      type: 'expense',
    })
    expect(screen.getByText('Ипотека')).toBeInTheDocument()
  })

  it('adds a category picked from the default list (Selecting a default category)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '+ Добавить категорию' }))
    await user.click(screen.getByRole('option', { name: 'Продукты' }))

    const month = useBudgetStore.getState().months[0]
    expect(month.categories.map((c) => c.name)).toEqual(['Продукты'])
  })

  it('does not offer a default category already in the active month (Default category already added)', async () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '+ Добавить категорию' }))
    expect(screen.queryByRole('option', { name: 'Продукты' })).not.toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Транспорт' })).toBeInTheDocument()
  })

  it('does not reorder the list when an amount is edited (Amount change does not reorder)', async () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Транспорт')
    const [products, transport] = useBudgetStore.getState().months[0].categories

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText(`Изменить сумму категории ${transport.name}`))
    const numberInput = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberInput)
    await user.type(numberInput, '5000')

    const stillInOrder = useBudgetStore.getState().months[0].categories
    expect(stillInOrder[0].id).toBe(products.id)
    expect(stillInOrder[1].id).toBe(transport.id)
    expect(stillInOrder[1].amount).toBe(5000)
  })

  it('appends a newly added category after existing ones, regardless of amount (New category appended)', () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    const productsId = useBudgetStore.getState().months[0].categories[0].id
    useBudgetStore.getState().setCategoryAmount('2026-08', productsId, 5000)

    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Транспорт')

    const names = useBudgetStore.getState().months[0].categories.map((c) => c.name)
    expect(names).toEqual(['Продукты', 'Транспорт'])
  })

  it('removes a category and restores it to its original position on Undo (Delete then undo)', async () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Транспорт')

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Удалить категорию Продукты'))

    expect(useBudgetStore.getState().months[0].categories.map((c) => c.name)).toEqual([
      'Транспорт',
    ])
    expect(screen.getByText('Категория «Продукты» удалена')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Отменить' }))

    expect(useBudgetStore.getState().months[0].categories.map((c) => c.name)).toEqual([
      'Продукты',
      'Транспорт',
    ])
  })

  it('leaves the category removed once the Undo window expires (Delete without undo)', () => {
    vi.useFakeTimers()
    try {
      useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
      render(<App />)

      const deleteButton = screen.getByLabelText('Удалить категорию Продукты')
      act(() => {
        deleteButton.click()
      })
      expect(useBudgetStore.getState().months[0].categories).toHaveLength(0)

      act(() => {
        vi.advanceTimersByTime(6000)
      })

      expect(screen.queryByText('Категория «Продукты» удалена')).not.toBeInTheDocument()
      expect(useBudgetStore.getState().months[0].categories).toHaveLength(0)
    } finally {
      vi.useRealTimers()
    }
  })
})
