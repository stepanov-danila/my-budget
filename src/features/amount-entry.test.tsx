import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'
import { useBudgetStore } from '../store/useBudgetStore'

function resetStore() {
  localStorage.clear()
  useBudgetStore.setState({
    theme: 'light',
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

describe('amount-entry', () => {
  it('opens a dialog with the amount editor when the amount is tapped (Opening the amount editor)', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.queryByLabelText('Сумма, вручную')).not.toBeInTheDocument()

    await openAmountDialog(user)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    const numberField = screen.getByLabelText('Сумма, вручную') as HTMLInputElement
    expect(numberField.value).toBe('0')
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

    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    expect(slider.min).toBe('0')
    expect(slider.max).toBe('50000')
    expect(slider.step).toBe('1000')
  })

  it('updates the slider when the manual field is edited (Manual entry updates slider)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '12400')

    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    expect(slider.value).toBe('12400')
    expect(getCategory().amount).toBe(12400)
  })

  it('updates the manual field when the slider is dragged (Slider updates field)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '15000' } })

    const numberField = screen.getByLabelText('Сумма, вручную') as HTMLInputElement
    expect(numberField.value).toBe('15000')
    expect(getCategory().amount).toBe(15000)
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
    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    expect(slider.max).toBe('50000')
  })

  it('grows the slider maximum when a typed value exactly matches it (Typed value exactly matches the max)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const numberField = screen.getByLabelText('Сумма, вручную')
    await user.clear(numberField)
    await user.type(numberField, '50000')

    expect(getCategory().sliderMax).toBe(100000)
    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    expect(slider.max).toBe('100000')
  })

  it('grows the slider maximum when dragged to its rightmost position (Dragged to edge)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)

    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement
    expect(slider.max).toBe('50000')

    fireEvent.change(slider, { target: { value: '50000' } })

    expect(getCategory().sliderMax).toBe(100000)
  })

  it('grows the slider maximum at most once per continuous drag gesture (Growth does not cascade within one drag)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await openAmountDialog(user)
    const slider = screen.getByLabelText('Сумма, слайдер') as HTMLInputElement

    fireEvent.pointerDown(slider)
    fireEvent.change(slider, { target: { value: '50000' } })
    expect(getCategory().sliderMax).toBe(100000)

    // Simulate the browser re-evaluating the thumb position against the
    // newly-grown range and landing exactly on the new max again, still
    // within the same drag gesture (pointer not yet released).
    fireEvent.change(slider, { target: { value: '100000' } })
    expect(getCategory().sliderMax).toBe(100000)
    expect(getCategory().amount).toBe(99999)

    fireEvent.pointerUp(slider)
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
