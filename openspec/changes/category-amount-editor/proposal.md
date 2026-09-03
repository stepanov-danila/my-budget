# Proposal: category-amount-editor

## Why

Three related pain points surfaced after using the app in production:

- Sorting categories by amount felt distracting and unpredictable — a row
  the user is still looking at can jump elsewhere in the list the moment an
  edit commits, making the list hard to scan while editing several
  categories in a row.
- The amount is shown twice in each row: once as a summary label next to
  the category name, and again inside the always-visible manual field. The
  two can look inconsistent while an edit is in progress and the duplication
  adds visual noise.
- The always-visible slider + field + stepper controls take up permanent
  space in every row and were called out as simply unpleasant to use inline.
  The user asked for amount entry to move into a popup opened by tapping the
  displayed value instead.

## What Changes

- **Remove category sorting entirely.** Categories keep a stable order:
  appended at the end when added, never reordered by amount. Undo restores
  a deleted category to its exact original position in the list instead of
  appending it back at the end.
- **Remove the duplicated amount display.** Each row shows the amount in
  exactly one place.
- **Move amount entry into a popup.** The single amount display becomes a
  tappable control that opens a modal dialog containing the existing slider
  + manual field + stepper buttons. The row itself no longer hosts an
  always-visible input.

## Capabilities

- **Modified: `category-management`** — remove the "Categories sorted by
  amount" requirement; add a "Category list order" requirement describing
  stable append-order and position-preserving Undo.
- **Modified: `amount-entry`** — add an "Amount editor via popup"
  requirement describing the tap-to-open dialog and the single, non-duplicated
  amount display it replaces.

## Impact

- `src/store/useBudgetStore.ts`: drop `sortCategories`/`resortCategories`;
  `addCategory`/`restoreCategory` append instead of sort-inserting;
  `removeCategory` tracks and returns the removed category's original index
  so `restoreCategory` can splice it back at that position.
- `src/components/CategoryRow.tsx`: replace the duplicate amount label +
  inline `AmountInput` with a single tappable amount button that opens a new
  dialog.
- New `src/components/AmountEditDialog.tsx`: modal wrapping the existing
  `AmountInput`, following the app's established dialog pattern.
- `src/components/AmountInput.tsx`: drop the now-unused `onBlur` prop (no
  sort-on-blur to trigger anymore).
- `src/components/CategorySection.tsx`: thread the removed category's index
  through the pending-undo state.
- Tests and `scripts/verify-full-flow.mjs` updated for the new interaction
  (open the popup, edit, close) and the removal of sort-related assertions.
- `docs/spec.md` sections 6 and 7 updated to match.
