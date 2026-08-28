import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Мой бюджет</h1>
      <ThemeToggle />
    </header>
  )
}
