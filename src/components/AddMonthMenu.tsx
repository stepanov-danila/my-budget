import { PlusOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import { useState } from 'react'
import { useBudgetStore } from '../store/useBudgetStore'

export function AddMonthMenu() {
  const [open, setOpen] = useState(false)
  const addMonth = useBudgetStore((state) => state.addMonth)
  const hasMonths = useBudgetStore((state) => state.months.length > 0)

  function handleAdd(mode: 'empty' | 'carry-over') {
    addMonth(mode)
    setOpen(false)
  }

  return (
    <>
      <Button
        type="text"
        shape="circle"
        aria-label="Добавить месяц"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      />

      <Modal
        title="Новый месяц"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <div
          role="menu"
          aria-label="Новый месяц"
          style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}
        >
          <Button
            role="menuitem"
            block
            style={{ textAlign: 'left' }}
            onClick={() => handleAdd('empty')}
          >
            Начать с пустого месяца
          </Button>
          <Button
            role="menuitem"
            block
            disabled={!hasMonths}
            style={{ textAlign: 'left' }}
            onClick={() => handleAdd('carry-over')}
          >
            Перенести категории и суммы из предыдущего месяца
          </Button>
        </div>
      </Modal>
    </>
  )
}
