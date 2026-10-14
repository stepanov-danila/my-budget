import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Switch } from 'antd'
import { useBudgetStore } from '../store/useBudgetStore'

export function ThemeToggle() {
  const theme = useBudgetStore((state) => state.theme)
  const toggleTheme = useBudgetStore((state) => state.toggleTheme)

  return (
    <Switch
      checked={theme === 'dark'}
      onChange={toggleTheme}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  )
}
