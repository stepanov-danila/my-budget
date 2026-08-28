import { useEffect } from 'react'
import { BalanceBar } from './components/BalanceBar'
import { MonthTabs } from './components/MonthTabs'
import { useBudgetStore } from './store/useBudgetStore'

function App() {
  const theme = useBudgetStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <MonthTabs />
      <BalanceBar />
    </div>
  )
}

export default App
