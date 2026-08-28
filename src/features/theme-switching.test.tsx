import { render, screen } from '@testing-library/react'
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

describe('theme-switching', () => {
  it('switches the UI to the dark color scheme (Switching to dark)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Включить тёмную тему'))

    expect(useBudgetStore.getState().theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('switches the UI back to the light color scheme (Switching to light)', async () => {
    useBudgetStore.setState({ theme: 'dark' })
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByLabelText('Включить светлую тему'))

    expect(useBudgetStore.getState().theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('re-applies the previously chosen dark theme after a reload (Reload after choosing dark)', async () => {
    useBudgetStore.getState().setTheme('dark')

    vi.resetModules()
    const { useBudgetStore: reloadedStore } = await import('../store/useBudgetStore')

    expect(reloadedStore.getState().theme).toBe('dark')
  })
})
