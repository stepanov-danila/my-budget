import { Typography, theme as antdTheme } from 'antd'
import { useBudgetStore } from '../store/useBudgetStore'
import { computeMonthTotals } from '../store/selectors'

const currencyFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function BalanceBar() {
  const { token } = antdTheme.useToken()
  const activeMonth = useBudgetStore((state) =>
    state.months.find((month) => month.id === state.activeMonthId),
  )
  const { income, expense, difference } = computeMonthTotals(activeMonth)
  const isPositive = difference >= 0

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '12px 16px',
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Typography.Text
        type="secondary"
        style={{
          display: 'block',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Баланс месяца
      </Typography.Text>
      <Typography.Title
        level={3}
        data-testid="balance-difference"
        style={{
          margin: '4px 0 0',
          color: isPositive ? token.colorSuccess : token.colorError,
        }}
      >
        {isPositive ? '+' : ''}
        {currencyFormatter.format(difference)}
      </Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>
        Доход{' '}
        <Typography.Text data-testid="balance-income" strong>
          {currencyFormatter.format(income)}
        </Typography.Text>{' '}
        / Расход{' '}
        <Typography.Text data-testid="balance-expense" strong>
          {currencyFormatter.format(expense)}
        </Typography.Text>
      </Typography.Text>
    </div>
  )
}
