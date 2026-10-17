import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useBudgetStore } from '../store/useBudgetStore'

function resetStore() {
  localStorage.clear()
  useBudgetStore.setState({
    activeMonthId: '2026-08',
    months: [{ id: '2026-08', label: 'Август 2026', categories: [] }],
  })
}

beforeEach(() => {
  resetStore()
  useBudgetStore.getState().addCategory('2026-08', 'expense', 'Продукты')
})

function getCategory() {
  return useBudgetStore.getState().months[0].categories[0]
}

async function openAmountDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByLabelText('Изменить сумму категории Продукты'))
}

function getSliderHandle() {
  return screen.getByLabelText('Сумма, слайдер')
}

/** AntD's Slider handle is keyboard-operable; 'End' jumps it to its max. */
function dragSliderToMax() {
  const handle = getSliderHandle()
  fireEvent.keyDown(handle, { key: 'End', keyCode: 35 })
}

function releaseSliderGesture() {
  fireEvent.keyUp(getSliderHandle(), { key: 'End', keyCode: 35 })
}

describe('amount-entry', () => {
  it('opens a dialog with the amount editor when the amount is tapped (Opening the amount editor)', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByLabelText('Сумма, вручную')).not.toBeInTheDocument()

    await openAmountDialog(user)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const numberField = screen.getByLabelText('Сумма, вручную') as HTMLInputElement
    expect(numberField.value).toBe('0')
    expect(numberField.type).toBe('number')
  })

  it('shows the amount exactly once per row, with no separate always-visible input (Single amount display without duplication)', () => {
    render(<App />)

    expect(screen.getByLabelText('Изменить сумму категории Продукты')).toHaveTextContent(
      '0',
    )
    expect(screen.queryByLabelText('Сумма, вручную')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Сумма, слайдер')).not.toBeInTheDocument()
  })

  it('closes the dialog and shows the updated amount on the row (Closing the editor)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await openAmountDialog(user)
    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '3000')

    await user.click(screen.getByRole('button', { name: 'Готово' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Изменить сумму категории Продукты')).toHaveTextContent(
      '3',
    )
    expect(getCategory().amount).toBe(3000)
  })

  it('initializes a new category with a 0-50,000 slider range (Fresh category default range)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const slider = getSliderHandle()
    expect(slider).toHaveAttribute('aria-valuemin', '0')
    expect(slider).toHaveAttribute('aria-valuemax', '50000')
  })

  it('updates the slider when the manual field is edited (Manual entry updates slider)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '12000')

    const slider = getSliderHandle()
    expect(slider).toHaveAttribute('aria-valuenow', '12000')
    expect(getCategory().amount).toBe(12000)
  })

  it('updates the manual field when the slider is dragged (Slider updates field)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const slider = getSliderHandle()
    fireEvent.keyDown(slider, { key: 'ArrowRight', keyCode: 39 })
    fireEvent.keyUp(slider, { key: 'ArrowRight', keyCode: 39 })

    const numberField = screen.getByLabelText('Сумма, вручную') as HTMLInputElement
    expect(numberField.value).toBe('1000')
    expect(getCategory().amount).toBe(1000)
  })

  it('does not grow the slider maximum when a typed value exceeds it without matching exactly (Typed value exceeds max)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '52000')

    expect(getCategory().amount).toBe(52000)
    expect(getCategory().sliderMax).toBe(50000)
    expect(getSliderHandle()).toHaveAttribute('aria-valuemax', '50000')
  })

  it('grows the slider maximum when a typed value exactly matches it (Typed value exactly matches the max)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '50000')

    expect(getCategory().sliderMax).toBe(100000)
    expect(getSliderHandle()).toHaveAttribute('aria-valuemax', '100000')
  })

  it('grows the slider maximum when dragged to its rightmost position (Dragged to edge)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    expect(getSliderHandle()).toHaveAttribute('aria-valuemax', '50000')

    dragSliderToMax()
    releaseSliderGesture()

    expect(getCategory().sliderMax).toBe(100000)
  })

  it('grows the slider maximum at most once per continuous drag gesture (Growth does not cascade within one drag)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    dragSliderToMax()
    expect(getCategory().sliderMax).toBe(100000)

    // Simulate the browser re-evaluating the handle's position against the
    // newly-grown range and landing exactly on the new max again, still
    // within the same gesture (key not yet released).
    dragSliderToMax()
    expect(getCategory().sliderMax).toBe(100000)
    expect(getCategory().amount).toBe(99999)

    releaseSliderGesture()
  })

  it('increments the amount by one step via the + button (Increment button)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    await user.click(screen.getByLabelText('Увеличить сумму'))

    expect(getCategory().amount).toBe(1000)
    const numberField = screen.getByLabelText('Сумма, вручную') as HTMLInputElement
    expect(numberField.value).toBe('1000')
  })

  it('decrements the amount by one step via the - button (Decrement button)', async () => {
    const user = userEvent.setup()
    render(<App />)

    const categoryId = getCategory().id
    useBudgetStore.getState().setCategoryAmount('2026-08', categoryId, 5000)

    await openAmountDialog(user)
    await user.click(screen.getByLabelText('Уменьшить сумму'))

    expect(getCategory().amount).toBe(4000)
  })

  it('does not decrement the amount below zero (Decrement does not go below zero)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    await user.click(screen.getByLabelText('Уменьшить сумму'))

    expect(getCategory().amount).toBe(0)
  })
})
