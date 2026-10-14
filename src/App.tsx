import { App as AntdApp, ConfigProvider, Layout, theme as antdTheme } from 'antd'
import { AppHeader } from './components/AppHeader'
import { BalanceBar } from './components/BalanceBar'
import { CategorySection } from './components/CategorySection'
import { MonthTabs } from './components/MonthTabs'
import { SAFE_AREA_HEADER_STYLE } from './constants/layout'
import { useBudgetStore } from './store/useBudgetStore'

function AppShell() {
  return (
    <Layout style={{ minHeight: '100svh' }}>
      <Layout.Header style={SAFE_AREA_HEADER_STYLE}>
        <AppHeader />
      </Layout.Header>
      <Layout.Content>
        <MonthTabs />
        <BalanceBar />
        <CategorySection />
      </Layout.Content>
    </Layout>
  )
}

function App() {
  const theme = useBudgetStore((state) => state.theme)

  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <AppShell />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
