import { useBudgetStore } from '../store/useBudgetStore'
import { computeMonthTotals } from '../store/selectors'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function BalanceBar() {
  const activeMonth = useBudgetStore((state) =>
    state.months.find((month) => month.id === state.activeMonthId),
  )
  const { income, expense, difference } = computeMonthTotals(activeMonth)

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
        Баланс месяца
      </p>
      <p
        data-testid="balance-difference"
        className={`text-3xl font-semibold ${
          difference >= 0
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {difference >= 0 ? '+' : ''}
        {currencyFormatter.format(difference)}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Доход <span data-testid="balance-income">{currencyFormatter.format(income)}</span>{' '}
        / Расход{' '}
        <span data-testid="balance-expense">{currencyFormatter.format(expense)}</span>
      </p>
    </div>
  )
}
