import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useBudgetStore } from '../store/useBudgetStore'

function resetStore() {
  localStorage.clear()
  useBudgetStore.setState({
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

    await user.click(screen.getByText('Доходы'))

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

  it('renders the category name field at a font size iOS Safari will not zoom in on (Name field avoids iOS zoom-on-focus)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '+ Добавить категорию' }))
    const nameField = screen.getByPlaceholderText('Своё название')

    expect(Number.parseInt(getComputedStyle(nameField).fontSize, 10)).toBeGreaterThanOrEqual(16)
  })

  it('blurs the name field on pointerdown of "Добавить", before the click, so Safari\'s first tap still works (Add button blurs before click)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '+ Добавить категорию' }))
    const nameField = screen.getByPlaceholderText('Своё название')
    await user.type(nameField, 'Ипотека')
    expect(nameField).toHaveFocus()

    const addButton = screen.getByRole('button', { name: 'Добавить' })
    fireEvent.pointerDown(addButton)
    expect(nameField).not.toHaveFocus()

    fireEvent.click(addButton)
    const month = useBudgetStore.getState().months[0]
    expect(month.categories.map((c) => c.name)).toEqual(['Ипотека'])
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

  it('leaves the category removed once the Undo window expires (Delete without undo)', async () => {
    // AntD's notification auto-close timer tracks elapsed time via
    // requestAnimationFrame, which captures the real native function at
    // module load (before fake timers could be installed), so this
    // waits out the real window instead of using vi.useFakeTimers().
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    render(<App />)

    const deleteButton = screen.getByLabelText('Удалить категорию Продукты')
    await act(async () => {
      deleteButton.click()
    })
    expect(useBudgetStore.getState().months[0].categories).toHaveLength(0)

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5300))
    })

    // The notification's own exit animation needs a transitionend event
    // jsdom never fires, so its removal from the DOM isn't asserted here;
    // the behavioral contract is that the category stays gone either way.
    expect(useBudgetStore.getState().months[0].categories).toHaveLength(0)
  }, 10000)
})
