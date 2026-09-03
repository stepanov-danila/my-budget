## Context

`AmountEditDialog` currently reuses the bottom-sheet-on-mobile pattern
shared with `ConfirmDialog`/`AddCategoryMenu`
(`items-end justify-center ... sm:items-center`). On a real device in
standalone PWA mode, its "Готово" button ends up near the bottom edge of
the screen, close to the home-indicator gesture area, with a fairly compact
tap target (`px-4 py-2`, ~36px tall).

## Goals / Non-Goals

**Goals:**
- Center the amount editor dialog on every viewport size.
- Give its confirm button a tap target comfortably at or above the ~44px
  minimum recommended size.

**Non-Goals:**
- No change to `ConfirmDialog`, `AddCategoryMenu`, or `AddMonthMenu` - the
  request is scoped to the amount editor popup only.
- No change to `AmountInput`'s internal behavior.

## Decisions

- Change `AmountEditDialog`'s backdrop classes from
  `flex items-end justify-center ... sm:items-center` to
  `flex items-center justify-center` unconditionally.
- Bump the "Готово" button from `px-4 py-2 text-sm` to a taller
  `px-4 py-3 text-base` so its tap target is comfortably larger, without
  changing the rest of the dialog's visual style.

## Risks / Trade-offs

- None expected: this only affects one dialog's position and one button's
  size, both purely presentational.
