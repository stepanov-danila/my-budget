import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
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
