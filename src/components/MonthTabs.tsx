import { CloseOutlined } from '@ant-design/icons'
import { App as AntdApp, Button, Tabs } from 'antd'
import { useBudgetStore } from '../store/useBudgetStore'
import { AddMonthMenu } from './AddMonthMenu'

export function MonthTabs() {
  const { modal } = AntdApp.useApp()
  const months = useBudgetStore((state) => state.months)
  const activeMonthId = useBudgetStore((state) => state.activeMonthId)
  const setActiveMonth = useBudgetStore((state) => state.setActiveMonth)
  const deleteMonth = useBudgetStore((state) => state.deleteMonth)

  function confirmDelete(monthId: string, label: string) {
    modal.confirm({
      title: `Удалить ${label}?`,
      content: 'Все категории и суммы этого месяца будут удалены без возможности отмены.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => deleteMonth(monthId),
    })
  }

  // Plain string labels keep each tab's accessible name just the month
  // label; a nested per-tab delete control would otherwise bleed its own
  // label into the tab's computed accessible name.
  const items = months.map((month) => ({ key: month.id, label: month.label }))

  return (
    <>
      <Tabs
        type="line"
        activeKey={activeMonthId ?? undefined}
        onChange={setActiveMonth}
        items={items}
        tabBarExtraContent={<AddMonthMenu />}
        tabBarStyle={{ margin: 0, padding: '0 8px' }}
      />
      {months.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            padding: '0 12px 8px',
          }}
        >
          {months.map((month) => (
            <Button
              key={month.id}
              type="text"
              size="small"
              aria-label={`Удалить ${month.label}`}
              icon={<CloseOutlined style={{ fontSize: 10 }} />}
              onClick={() => confirmDelete(month.id, month.label)}
              style={{ flexShrink: 0 }}
            >
              {month.label}
            </Button>
          ))}
        </div>
      )}
    </>
  )
}
