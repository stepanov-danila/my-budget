# Proposal

## Why

`fix-safari-input-focus-bugs` fixed the iOS Safari "first tap only blurs,
second tap clicks" issue for the two confirm/submit buttons ("Готово",
"Добавить"), but missed the other buttons that sit next to the same
focusable fields inside those two dialogs. The amount editor's `+`/`-`
stepper buttons never got the fix, so tapping them right after typing in
the manual field or dragging the slider still needs two taps.

## What Changes

- Apply the same pointerdown-blur handling (`blurActiveElement`, already
  used by "Готово"/"Добавить") to the amount editor's increment ("+") and
  decrement ("-") stepper buttons in `AmountInput.tsx`.
- Apply it as well to the add-category dialog's default-category option
  buttons (`AddCategoryMenu.tsx`'s list items), which sit next to the name
  field and can suffer the same issue if tapped right after typing.
  (Assumption: "все контролы модалки" is read as every remaining
  unprotected button in both dialogs that sit next to a focusable field,
  not only the amount editor — flag if narrower scope was intended.)

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — platform-event fix only, no requirement text changes)

## Impact

- `src/components/AmountInput.tsx` — add `onPointerDown={blurActiveElement}`
  to the increment and decrement buttons.
- `src/components/AddCategoryMenu.tsx` — add the same handler to the
  default-category option buttons rendered in the list.
- No new dependencies; reuses the existing `src/lib/blurActiveElement.ts`
  helper. No spec-level behavior changes.
