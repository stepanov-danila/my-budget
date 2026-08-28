import { beforeEach, describe, expect, it } from 'vitest'
import type { AppState } from '../types'
import { loadState, saveState, STORAGE_KEY } from './storage'

const sampleState: AppState = {
  theme: 'dark',
  activeMonthId: 'month-1',
  months: [
    {
      id: 'month-1',
      label: 'Август 2026',
      categories: [
        { id: 'cat-1', type: 'expense', name: 'Продукты', amount: 12400, sliderMax: 50000 },
      ],
    },
  ],
}

beforeEach(() => {
  localStorage.clear()
})

describe('storage', () => {
  it('returns null when nothing has been saved yet', () => {
    expect(loadState()).toBeNull()
  })

  it('round-trips state through save and load', () => {
    saveState(sampleState)
    expect(loadState()).toEqual(sampleState)
  })

  it('persists under the versioned storage key', () => {
    saveState(sampleState)
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('returns null for corrupted data instead of throwing', () => {
    localStorage.setItem(STORAGE_KEY, '{not valid json')
    expect(loadState()).toBeNull()
  })
})
