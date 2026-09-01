import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useBudgetStore } from './store/useBudgetStore'

beforeEach(() => {
  localStorage.clear()
  useBudgetStore.setState({
    theme: 'light',
    activeMonthId: '2026-08',
    months: [{ id: '2026-08', label: 'Август 2026', categories: [] }],
  })
})

describe('App layout', () => {
  it('pads the root container by the safe-area top inset (Standalone launch on a device with a status bar or notch)', () => {
    const { container } = render(<App />)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('pt-[env(safe-area-inset-top)]')
  })
})
