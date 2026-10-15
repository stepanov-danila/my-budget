import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSystemTheme } from './useSystemTheme'

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

describe('useSystemTheme', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('reads the initial system theme (Launching with a system theme)', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useSystemTheme())

    expect(result.current).toBe('dark')
  })

  it('updates live when the system theme changes (System theme changes while the app is open)', () => {
    const { emitChange } = mockMatchMedia(false)

    const { result } = renderHook(() => useSystemTheme())
    expect(result.current).toBe('light')

    act(() => {
      emitChange(true)
    })

    expect(result.current).toBe('dark')
  })
})
