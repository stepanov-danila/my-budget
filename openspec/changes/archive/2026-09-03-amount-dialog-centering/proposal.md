# Proposal: amount-dialog-centering

## Why

The amount editor dialog (added in `category-amount-editor`) opens as a
bottom sheet on mobile viewports, matching `ConfirmDialog`/`AddCategoryMenu`.
Two problems surfaced in real use:

- The user wants the amount popup centered on screen instead of anchored to
  the bottom.
- The "Готово" confirm button, sitting near the bottom edge of that sheet,
  is hard to tap and sometimes doesn't register the first tap. Anchored to
  the bottom edge, it sits right where a standalone PWA's home-indicator
  gesture area and small tap target (compact padding, ~36px tall) compete
  for the same touch - both are addressed by moving the dialog away from
  the edge and giving the button a larger tap target.

## What Changes

- The amount editor dialog is always centered on screen, on every viewport
  size, instead of behaving as a bottom sheet on mobile.
- The "Готово" button gets a larger tap target (taller padding, comfortably
  above the ~44px minimum recommended touch-target size).

## Capabilities

- **Modified: `amount-entry`** — the "Amount editor via popup" requirement
  gains a scenario describing the dialog's centered position.

## Impact

- `src/components/AmountEditDialog.tsx`: drop the `items-end ...
  sm:items-center` bottom-sheet layout in favor of always-centered; enlarge
  the "Готово" button's tap target.
- No other dialogs (`ConfirmDialog`, `AddCategoryMenu`, `AddMonthMenu`) are
  touched - the request is scoped to the amount editor popup.
