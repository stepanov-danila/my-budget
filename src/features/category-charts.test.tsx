import { act, render, screen } from '@testing-library/react'
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

describe('category-charts', () => {
  it('shows an empty state instead of a chart when there are no categories (No categories yet)', () => {
    render(<App />)

    expect(screen.getByTestId('category-chart-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('category-chart')).not.toBeInTheDocument()
  })

  it('shows a breakdown chart for the active view once categories have amounts (Viewing expense chart)', () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    const categoryId = useBudgetStore.getState().months[0].categories[0].id
    useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 12400)

    render(<App />)

    expect(screen.getByTestId('category-chart')).toBeInTheDocument()
    expect(screen.queryByTestId('category-chart-empty')).not.toBeInTheDocument()
  })

  it('re-renders the chart when a category amount changes (Chart reflects new category)', () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    render(<App />)

    expect(screen.getByTestId('category-chart-empty')).toBeInTheDocument()

    const categoryId = useBudgetStore.getState().months[0].categories[0].id
    act(() => {
      useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 3000)
    })

    expect(screen.getByTestId('category-chart')).toBeInTheDocument()
  })

  it('re-renders the chart when a category is added', () => {
    render(<App />)
    expect(screen.getByTestId('category-chart-empty')).toBeInTheDocument()

    act(() => {
      useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
      const categoryId = useBudgetStore.getState().months[0].categories[0].id
      useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 1000)
    })

    expect(screen.getByTestId('category-chart')).toBeInTheDocument()
  })

  it('re-renders the chart when a category is removed back to empty', () => {
    useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
    const categoryId = useBudgetStore.getState().months[0].categories[0].id
    useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 1000)

    render(<App />)
    expect(screen.getByTestId('category-chart')).toBeInTheDocument()

    act(() => {
      useBudgetStore.getState().removeCategory('2026-08', categoryId)
    })

    expect(screen.getByTestId('category-chart-empty')).toBeInTheDocument()
  })
})
