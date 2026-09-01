## 1. Sort categories on blur, not on every amount change

- [ ] 1.1 Split `useBudgetStore`'s `setCategoryAmount` so it no longer sorts, and add a `resortCategories(monthId)` action that sorts that month's categories by amount descending; verify with a store-level test that `setCategoryAmount` leaves order unchanged and `resortCategories` reorders
- [ ] 1.2 Add an `onBlur` prop to `AmountInput` wired to both its number and range inputs, and have `CategoryRow` call `resortCategories` from it; verify a component test that typing/dragging without blurring leaves list order unchanged, and blurring reorders (per category-management spec: Reorder after an amount edit is committed, No reorder while a field is still focused)
- [ ] 1.3 Update existing tests/assertions that expected immediate reordering on `setCategoryAmount` (store and component tests) to reflect the new blur-triggered contract

## 2. Adaptive slider maximum: exact match only

- [ ] 2.1 Change the growth condition in `setCategoryAmount` from `amount >= sliderMax` to `amount === sliderMax`; verify with store tests: dragging to the current max grows it, typing a value that jumps past the max without matching it exactly does not grow it (amount still saves), typing the exact max value grows it (per amount-entry spec: Dragged to edge, Typed value exceeds max, Typed value exactly matches the max)
- [ ] 2.2 Update the amount-entry component tests to match the new exact-match contract

## 3. Slider step: 1,000

- [ ] 3.1 Change `AmountInput`'s step constant from 100 to 1,000 and verify a test asserts the rendered slider/number inputs use step 1000 (per amount-entry spec: Fresh category default range)

## 4. Safe-area padding in standalone PWA mode

- [ ] 4.1 Add `pt-[env(safe-area-inset-top)]` (or equivalent) to the app's root container so the header and sticky balance bar clear the device status bar in standalone mode, and verify the class/style is present in the rendered output (per pwa-shell spec: Standalone launch on a device with a status bar or notch)

## 5. Final verification

- [ ] 5.1 Run lint, type-check, and the full test suite; run the existing Playwright full-flow script against a fresh production build and confirm the flow still passes with the new sort-on-blur and slider behavior
- [ ] 5.2 Run `openspec validate --change "ux-refinements" --strict` and verify it passes with no errors
