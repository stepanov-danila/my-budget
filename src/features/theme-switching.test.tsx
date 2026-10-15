import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { useBudgetStore } from '../store/useBudgetStore'

function resetStore() {
  localStorage.clear()
  useBudgetStore.setState({
    activeMonthId: '2026-08',
    months: [{ id: '2026-08', label: 'Август 2026', categories: [] }],
  })
}

function mockMatchMedia(initialMatches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | null = null
  const mediaQueryList = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (
      _event: string,
      callback: (event: MediaQueryListEvent) => void,
    ) => {
      listener = callback
    },
    removeEventListener: () => {
      listener = null
    },
  }

  window.matchMedia = vi.fn().mockReturnValue(mediaQueryList) as typeof window.matchMedia

  return {
    emitChange(matches: boolean) {
      mediaQueryList.matches = matches
      listener?.({ matches } as MediaQueryListEvent)
    },
  }
}

// AntD's ConfigProvider algorithm (light vs dark) picks different token
// values for the same semantic color; the balance bar's positive-amount
// color (driven by `token.colorSuccess`) is a simple, already-rendered
// signal that the algorithm actually switched.
function getBalanceColor() {
  return screen.getByTestId('balance-difference').style.color
}

describe('theme-switching', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('renders using the OS/browser color scheme on launch (Launching with a system theme)', () => {
    mockMatchMedia(false)
    const { unmount } = render(<App />)
    const lightColor = getBalanceColor()
    unmount()

    mockMatchMedia(true)
    render(<App />)
    const darkColor = getBalanceColor()

    expect(darkColor).not.toBe(lightColor)
  })

  it('re-renders immediately when the system theme changes while open (System theme changes while the app is open)', () => {
    const { emitChange } = mockMatchMedia(false)

    render(<App />)
    const colorBefore = getBalanceColor()

    act(() => {
      emitChange(true)
    })

    const colorAfter = getBalanceColor()
    expect(colorAfter).not.toBe(colorBefore)
  })
})
