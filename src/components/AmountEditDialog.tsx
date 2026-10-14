import { Button, Modal } from 'antd'
import { AmountInput } from './AmountInput'

interface AmountEditDialogProps {
  categoryName: string
  value: number
  sliderMax: number
  onChange: (value: number) => void
  onClose: () => void
}

export function AmountEditDialog({
  categoryName,
  value,
  sliderMax,
  onChange,
  onClose,
}: AmountEditDialogProps) {
  return (
    <Modal
      title={categoryName}
      open
      centered
      onCancel={onClose}
      footer={
        <Button type="primary" block size="large" onClick={onClose}>
          Готово
        </Button>
      }
    >
      <div style={{ marginTop: 16 }}>
        <AmountInput value={value} sliderMax={sliderMax} onChange={onChange} />
      </div>
    </Modal>
  )
}
