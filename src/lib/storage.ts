import type { AppState } from '../types'

export const STORAGE_KEY = 'my-budget:v1'

export function loadState(): AppState | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AppState
  } catch {
    return null
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
