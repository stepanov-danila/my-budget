import { App as AntdApp, ConfigProvider, Layout, theme as antdTheme } from 'antd'
import { BalanceBar } from './components/BalanceBar'
import { CategorySection } from './components/CategorySection'
import { MonthTabs } from './components/MonthTabs'
import { SAFE_AREA_TOP_STYLE } from './constants/layout'
import { useSystemTheme } from './hooks/useSystemTheme'

function AppShell() {
  return (
    <Layout style={{ minHeight: '100svh' }}>
      <Layout.Content style={SAFE_AREA_TOP_STYLE}>
        <MonthTabs />
        <BalanceBar />
        <CategorySection />
      </Layout.Content>
    </Layout>
  )
}

function App() {
  const theme = useSystemTheme()

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
