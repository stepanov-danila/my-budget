import { useId, useRef } from 'react'

interface AmountInputProps {
  value: number
  sliderMax: number
  onChange: (value: number) => void
  onBlur?: () => void
}

const SLIDER_STEP = 1000

export function AmountInput({ value, sliderMax, onChange, onBlur }: AmountInputProps) {
  const id = useId()
  const isDraggingRef = useRef(false)
  const grewDuringDragRef = useRef(false)

  function handleSliderPointerDown() {
    isDraggingRef.current = true
    grewDuringDragRef.current = false
  }

  function handleSliderPointerUp() {
    isDraggingRef.current = false
    grewDuringDragRef.current = false
  }

  function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
    let next = Number(event.target.value)

    if (isDraggingRef.current && next === sliderMax) {
      if (grewDuringDragRef.current) {
        // The slider max already grew once in this drag gesture. If the
        // browser re-evaluates the thumb position against the new,
        // larger range and lands exactly on the new max again (without
        // the user releasing and re-dragging), nudge below it so the
        // store's exact-match growth check doesn't fire a second time
        // for what is still, from the user's perspective, one gesture.
        next -= 1
      } else {
        grewDuringDragRef.current = true
      }
    }

    onChange(next)
  }

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = Number(event.target.value)
    onChange(Number.isNaN(next) ? 0 : Math.max(0, next))
  }

  function handleIncrement() {
    onChange(value + SLIDER_STEP)
    onBlur?.()
  }

  function handleDecrement() {
    onChange(Math.max(0, value - SLIDER_STEP))
    onBlur?.()
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
        onPointerDown={handleSliderPointerDown}
        onPointerUp={handleSliderPointerUp}
        onPointerCancel={handleSliderPointerUp}
        onBlur={onBlur}
        aria-label="Сумма, слайдер"
        className="h-2 flex-1 accent-blue-600"
      />
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label="Уменьшить сумму"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          −
        </button>
        <input
          id={`${id}-number`}
          type="number"
          min={0}
          step={SLIDER_STEP}
          value={value}
          onChange={handleNumberChange}
          onBlur={onBlur}
          aria-label="Сумма, вручную"
          className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="button"
          onClick={handleIncrement}
          aria-label="Увеличить сумму"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          +
        </button>
      </div>
    </div>
  )
}
