import { Typography } from 'antd'
import { ThemeToggle } from './ThemeToggle'

export function AppHeader() {
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Typography.Title level={4} style={{ margin: 0 }}>
        Мой бюджет
      </Typography.Title>
      <ThemeToggle />
    </div>
  )
}
