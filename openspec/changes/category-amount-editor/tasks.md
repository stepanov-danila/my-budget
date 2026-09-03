## 1. Store: remove sorting, add position-preserving Undo

- [ ] 1.1 Remove `sortCategories` and the `resortCategories` action from `useBudgetStore.ts`
- [ ] 1.2 Change `addCategory` to append the new category instead of sort-inserting
- [ ] 1.3 Change `removeCategory` to return `{ category, index } | null`, capturing the category's index in the month's category array before removing it
- [ ] 1.4 Change `restoreCategory` to accept an `index` parameter and splice the category back in at that position (clamped to the current array length)
- [ ] 1.5 Update `BudgetActions` types accordingly

## 2. UI: single amount display via popup dialog

- [ ] 2.1 Create `src/components/AmountEditDialog.tsx` following the `ConfirmDialog`/`AddCategoryMenu` modal pattern, wrapping the existing `AmountInput`
- [ ] 2.2 Update `CategoryRow.tsx`: remove the duplicate amount `<p>` and the inline `AmountInput`; render a single tappable amount button that opens `AmountEditDialog`; remove the `resortCategories` call and `onBlur` wiring
- [ ] 2.3 Remove the now-unused `onBlur` prop from `AmountInput.tsx`
- [ ] 2.4 Update `CategorySection.tsx` to carry the removed category's index through `pendingUndo` and pass it to `restoreCategory`

## 3. Tests

- [ ] 3.1 Update `src/store/useBudgetStore.test.ts`: remove `resortCategories`/sort-order assertions, add append-order and index-preserving Undo tests
- [ ] 3.2 Update `src/features/category-management.test.tsx`: remove sort-related tests, add stable-order and Undo-position tests, open the amount dialog before interacting with amount controls where needed
- [ ] 3.3 Update `src/features/amount-entry.test.tsx`: open the amount dialog before querying slider/field/stepper controls
- [ ] 3.4 Update `scripts/verify-full-flow.mjs`: remove the sort-on-blur assertions, click the amount to open the dialog before editing it

## 4. Docs and verification

- [ ] 4.1 Update `docs/spec.md` sections 6 and 7 to describe stable list order and popup-based amount entry
- [ ] 4.2 Run lint, typecheck, unit tests, production build, and `node scripts/verify-full-flow.mjs`
- [ ] 4.3 `openspec validate category-amount-editor --strict`
