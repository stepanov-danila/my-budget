import { useId } from 'react'

interface AmountInputProps {
  value: number
  sliderMax: number
  onChange: (value: number) => void
}

const SLIDER_STEP = 100

export function AmountInput({ value, sliderMax, onChange }: AmountInputProps) {
  const id = useId()

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(Number(event.target.value))
  }

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(event.target.value)
    onChange(Number.isNaN(next) ? 0 : Math.max(0, next))
  }

  return (
    <div className="flex items-center gap-3">
      <input
        id={`${id}-range`}
        type="range"
        min={0}
        max={sliderMax}
        step={SLIDER_STEP}
        value={Math.min(value, sliderMax)}
        onChange={handleSliderChange}
        aria-label="Сумма, слайдер"
        className="h-2 flex-1 accent-blue-600"
      />
      <input
        id={`${id}-number`}
        type="number"
        min={0}
        step={SLIDER_STEP}
        value={value}
        onChange={handleNumberChange}
        aria-label="Сумма, вручную"
        className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm dark:border-slate-600 dark:bg-slate-800"
      />
    </div>
  )
}
