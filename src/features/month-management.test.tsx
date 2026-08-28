import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
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

describe('month-management', () => {
  it('always shows the active month balance on screen', () => {
    render(<App />)
    expect(screen.getByText('Баланс месяца')).toBeInTheDocument()
  })

  it('creates an empty month and makes it active (Create empty month)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Добавить месяц'))
    await user.click(screen.getByRole('menuitem', { name: 'Начать с пустого месяца' }))

    const newTab = screen.getByRole('button', { name: 'Сентябрь 2026' })
    expect(newTab).toHaveAttribute('aria-current', 'true')
    expect(
      useBudgetStore.getState().months.find((m) => m.id === '2026-09')?.categories,
    ).toEqual([])
  })

  it('carries over categories and amounts from the previous month (Create month copied from previous)', async () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    const categoryId = useBudgetStore.getState().months[0].categories[0].id
    useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 5000)

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Добавить месяц'))
    await user.click(
      screen.getByRole('menuitem', {
        name: 'Перенести категории и суммы из предыдущего месяца',
      }),
    )

    const newMonth = useBudgetStore.getState().months.find((m) => m.id === '2026-09')
    expect(newMonth?.categories).toHaveLength(1)
    expect(newMonth?.categories[0].amount).toBe(5000)
    expect(newMonth?.categories[0].name).toBe('Продукты')
    expect(newMonth?.categories[0].id).not.toBe(categoryId)
  })

  it('switches the active month when a different tab is tapped (Switching active month)', async () => {
    useBudgetStore.setState({
      months: [
        { id: '2026-07', label: 'Июль 2026', categories: [] },
        { id: '2026-08', label: 'Август 2026', categories: [] },
      ],
      activeMonthId: '2026-08',
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Июль 2026' }))
    expect(useBudgetStore.getState().activeMonthId).toBe('2026-07')
  })

  it('deletes a month after the user confirms (Confirmed deletion)', async () => {
    useBudgetStore.setState({
      months: [
        { id: '2026-07', label: 'Июль 2026', categories: [] },
        { id: '2026-08', label: 'Август 2026', categories: [] },
      ],
      activeMonthId: '2026-08',
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Удалить Июль 2026'))
    const dialog = screen.getByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Удалить' }))

    expect(useBudgetStore.getState().months.map((m) => m.id)).toEqual(['2026-08'])
  })

  it('keeps the month when deletion is cancelled (Cancelled deletion)', async () => {
    useBudgetStore.setState({
      months: [
        { id: '2026-07', label: 'Июль 2026', categories: [] },
        { id: '2026-08', label: 'Август 2026', categories: [] },
      ],
      activeMonthId: '2026-08',
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Удалить Июль 2026'))
    const dialog = screen.getByRole('alertdialog')
    await user.click(within(dialog).getByRole('button', { name: 'Отмена' }))

    expect(useBudgetStore.getState().months.map((m) => m.id)).toEqual([
      '2026-07',
      '2026-08',
    ])
  })

  it('updates the balance immediately when a category amount changes', () => {
    useBudgetStore.getState().addCategory('2026-08', 'income', 'Зарплата')
    render(<App />)

    expect(screen.getByTestId('balance-difference')).toHaveTextContent('+0')

    const categoryId = useBudgetStore.getState().months[0].categories[0].id
    act(() => {
      useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 85000)
    })

    expect(screen.getByTestId('balance-difference')).toHaveTextContent(/85\s?000/)
  })

  it('supports several independently editable months (Multiple months supported)', () => {
    useBudgetStore.setState({
      months: [
        { id: '2026-07', label: 'Июль 2026', categories: [] },
        { id: '2026-08', label: 'Август 2026', categories: [] },
        { id: '2026-09', label: 'Сентябрь 2026', categories: [] },
      ],
      activeMonthId: '2026-08',
    })

    render(<App />)
    expect(screen.getByRole('button', { name: 'Июль 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Август 2026' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сентябрь 2026' })).toBeInTheDocument()
  })
})
