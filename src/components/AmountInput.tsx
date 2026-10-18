import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, InputNumber, Slider } from 'antd'
import { useRef } from 'react'

interface AmountInputProps {
  value: number
  sliderMax: number
  onChange: (value: number) => void
}

const SLIDER_STEP = 1000

export function AmountInput({ value, sliderMax, onChange }: AmountInputProps) {
  /** Guards the adaptive-slider-max growth so it fires at most once per continuous gesture. */
  const grewDuringDragRef = useRef(false)

  function handleSliderChange(next: number) {
    let nextValue = next

    if (nextValue === sliderMax) {
      if (grewDuringDragRef.current) {
        nextValue -= 1
      } else {
        grewDuringDragRef.current = true
      }
    }

    onChange(nextValue)
  }

  function handleSliderChangeComplete() {
    grewDuringDragRef.current = false
  }

  function handleNumberChange(next: number | null) {
    onChange(next === null || Number.isNaN(next) ? 0 : Math.max(0, next))
  }

  function handleIncrement() {
    onChange(value + SLIDER_STEP)
  }

  function handleDecrement() {
    onChange(Math.max(0, value - SLIDER_STEP))
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Slider
        ariaLabelForHandle="Сумма, слайдер"
        min={0}
        max={sliderMax}
        step={SLIDER_STEP}
        value={Math.min(value, sliderMax)}
        onChange={handleSliderChange}
        onChangeComplete={handleSliderChangeComplete}
        tooltip={{ open: false }}
        style={{ flex: 1 }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <Button
          shape="circle"
          size="small"
          aria-label="Уменьшить сумму"
          icon={<MinusOutlined />}
          onClick={handleDecrement}
        />
        <InputNumber
          aria-label="Сумма, вручную"
          inputMode="numeric"
          min={0}
          step={SLIDER_STEP}
          value={value}
          onChange={handleNumberChange}
          controls={false}
          style={{ width: 88 }}
        />
        <Button
          shape="circle"
          size="small"
          aria-label="Увеличить сумму"
          icon={<PlusOutlined />}
          onClick={handleIncrement}
        />
      </div>
    </div>
  )
}
