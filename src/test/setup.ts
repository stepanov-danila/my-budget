import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// jsdom reports zero layout size, which makes Recharts' ResponsiveContainer
// skip rendering its chart. Give it a stable non-zero size in tests.
Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 400,
})
Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 300,
})

// jsdom implements neither API; Ant Design's ConfigProvider/Grid (matchMedia)
// and Modal/ResizeObserver-based components need both to mount in tests.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

if (typeof window.ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  ;(window as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverMock
}
