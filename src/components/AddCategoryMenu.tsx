import { Button, Input, List, Modal, Typography } from 'antd'
import { useId, useState } from 'react'
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from '../constants/categories'
import { blurActiveElement } from '../lib/blurActiveElement'
import { useBudgetStore } from '../store/useBudgetStore'
import type { CategoryType } from '../types'

interface AddCategoryMenuProps {
  monthId: string
  type: CategoryType
  existingNames: string[]
}

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
}

export function AddCategoryMenu({ monthId, type, existingNames }: AddCategoryMenuProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const addCategory = useBudgetStore((state) => state.addCategory)
  const inputId = useId()

  const defaults =
    type === 'expense' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_INCOME_CATEGORIES
  const availableDefaults = defaults.filter(
    (defaultName) => !existingNames.includes(defaultName),
  )

  function close() {
    setOpen(false)
    setName('')
  }

  function handleManualSubmit() {
    const trimmed = name.trim()
    if (!trimmed) return
    addCategory(monthId, type, trimmed)
    close()
  }

  function handleSelectDefault(categoryName: string) {
    addCategory(monthId, type, categoryName)
    close()
  }

  return (
    <>
      <Button
        type="dashed"
        block
        onClick={() => setOpen(true)}
        style={{ margin: '12px 16px 0', width: 'calc(100% - 32px)' }}
      >
        + Добавить категорию
      </Button>

      <Modal title="Новая категория" open={open} onCancel={close} footer={null}>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleManualSubmit()
          }}
          style={{ display: 'flex', gap: 8, marginTop: 16 }}
        >
          <label htmlFor={inputId} style={visuallyHidden}>
            Название категории
          </label>
          <Input
            id={inputId}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Своё название"
            styles={{ input: { fontSize: 16 } }}
          />
          <Button type="primary" htmlType="submit" onPointerDown={blurActiveElement}>
            Добавить
          </Button>
        </form>

        {availableDefaults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Typography.Text
              type="secondary"
              style={{ fontSize: 12, textTransform: 'uppercase' }}
            >
              Или выбрать из списка
            </Typography.Text>
            <List
              style={{ marginTop: 8, maxHeight: 224, overflowY: 'auto' }}
              dataSource={availableDefaults}
              renderItem={(categoryName) => (
                <List.Item style={{ padding: 0, border: 'none' }}>
                  <Button
                    type="text"
                    role="option"
                    aria-selected={false}
                    block
                    onPointerDown={blurActiveElement}
                    onClick={() => handleSelectDefault(categoryName)}
                    style={{ textAlign: 'left' }}
                  >
                    {categoryName}
                  </Button>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </>
  )
}
