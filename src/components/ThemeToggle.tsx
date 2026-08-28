import { useBudgetStore } from '../store/useBudgetStore'

export function ThemeToggle() {
  const theme = useBudgetStore((state) => state.theme)
  const toggleTheme = useBudgetStore((state) => state.toggleTheme)

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-base dark:border-slate-600"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
