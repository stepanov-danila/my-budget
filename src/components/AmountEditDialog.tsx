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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="amount-edit-dialog-title"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="amount-edit-dialog-title"
          className="text-lg font-semibold text-slate-900 dark:text-slate-100"
        >
          {categoryName}
        </h2>

        <div className="mt-4">
          <AmountInput value={value} sliderMax={sliderMax} onChange={onChange} />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-medium text-white"
        >
          Готово
        </button>
      </div>
    </div>
  )
}
