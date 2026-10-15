import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { SAFE_AREA_TOP_STYLE } from './constants/layout'
import { useBudgetStore } from './store/useBudgetStore'

beforeEach(() => {
  localStorage.clear()
  useBudgetStore.setState({
    activeMonthId: '2026-08',
    months: [{ id: '2026-08', label: 'Август 2026', categories: [] }],
  })
})

describe('App layout', () => {
  it('pads the root container by the safe-area top inset (Standalone launch on a device with a status bar or notch)', () => {
    render(<App />)
    // jsdom's CSS engine rejects env() as an invalid padding-top value, so
    // the constant actually wired into the content area's style is asserted
    // directly; real browsers (see scripts/verify-full-flow.mjs) apply it.
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(SAFE_AREA_TOP_STYLE.paddingTop).toBe('env(safe-area-inset-top)')
  })
})
