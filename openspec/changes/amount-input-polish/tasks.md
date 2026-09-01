## 1. More default categories

- [ ] 1.1 Add Кредиты, Аренда, Такси, Домашние животные, Спорт to `DEFAULT_EXPENSE_CATEGORIES`, and Аренда to `DEFAULT_INCOME_CATEGORIES`; update the existing unit test asserting the lists' exact contents
- [ ] 1.2 Update `docs/spec.md` sections 6.1/6.2 to match the new default lists

## 2. No cascading slider-max growth within one drag

- [ ] 2.1 Add a pointer-drag guard to `AmountInput`'s range input (`onPointerDown`/`onPointerUp`, plus a ref marking "already grew this gesture") so reaching the current max only registers as one growth event per continuous drag; verify with a component test that simulates multiple ticks landing on successive maxima within one drag and asserts only one growth step happened (per amount-entry spec: Growth does not cascade within one drag)
- [ ] 2.2 Verify the existing "Dragged to edge" and "Typed value exactly matches the max" scenarios still pass unaffected (typing goes through the number field, not the guarded range-drag path)

## 3. Stepper buttons for fine adjustment

- [ ] 3.1 Add increment/decrement buttons to `AmountInput` next to the number field, adjusting the amount by the step constant (1,000) and reusing the existing `onChange`; verify component tests for increment, decrement, and decrement clamping at zero (per amount-entry spec: Increment button, Decrement button, Decrement does not go below zero)

## 4. Final verification

- [ ] 4.1 Run lint, type-check, and the full test suite; run the existing Playwright full-flow script against a fresh production build
- [ ] 4.2 Run `openspec validate --change "amount-input-polish" --strict` and verify it passes with no errors
