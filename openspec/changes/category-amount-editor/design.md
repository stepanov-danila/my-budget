## Context

Categories currently sort by amount descending, recalculated on blur
(`resortCategories`, wired via an `onBlur` prop threaded through
`AmountInput` → `CategoryRow`). Each row shows the amount twice: a summary
`<p>` next to the name, and again inside the always-visible `AmountInput`
number field. `AmountInput` (slider + field + +/− steppers) is rendered
inline in every row.

## Goals / Non-Goals

**Goals:**
- Stable, predictable category order: append on add, unaffected by amount
  edits, and restored to its exact original position on Undo.
- One amount display per row.
- Amount editing happens in a popup opened by tapping the amount, not
  inline in the row.

**Non-Goals:**
- No change to `AmountInput`'s internal slider/field/stepper behavior
  (drag-growth guard, step size, clamping) - it moves into a dialog as-is.
- No change to how categories are added, deleted, or how Undo's time
  window works - only *where* a restored category lands in the list.

## Decisions

- **Drop `sortCategories`/`resortCategories` entirely.** `addCategory`
  appends to the month's category array instead of sort-inserting.
  `restoreCategory` no longer re-sorts.
- **Position-preserving Undo.** `removeCategory` now returns
  `{ category, index } | null` instead of `Category | null`, capturing the
  array index at removal time. `CategorySection`'s `pendingUndo` state
  carries that index alongside the category, and `restoreCategory` gains an
  `index` parameter, splicing the category back in at that position (falling
  back to appending if the index is now out of bounds, e.g. other categories
  of the same type were deleted in the meantime - an edge case simple enough
  not to warrant its own scenario, handled defensively with
  `Math.min(index, categories.length)`).
- **New `AmountEditDialog` component**, following the existing
  `ConfirmDialog`/`AddCategoryMenu` modal pattern (`fixed inset-0` backdrop,
  centered card, `stopPropagation` on the card). It renders the category
  name as a heading, the existing `AmountInput` unchanged, and a "Готово"
  button that closes it. Local `open` state lives in `CategoryRow`.
- **`CategoryRow`'s amount display becomes a single `<button>`** (e.g.
  `aria-label="Изменить сумму категории {name}"`) showing the formatted
  amount, opening the dialog on click. The row's `isInteractiveTarget` swipe
  guard already excludes buttons, so this needs no swipe-handling changes.
- **Drop `AmountInput`'s `onBlur` prop.** It existed solely to trigger
  `resortCategories`; with sorting gone there is nothing left to call on
  blur.

## Risks / Trade-offs

- Removing sort-on-blur changes documented UX (`docs/spec.md` section 6)
  and the shipped `category-management` capability - both are updated as
  part of this change.
- Position-preserving Undo adds a small amount of index bookkeeping to
  `CategorySection`, but keeps the mental model simple: Undo puts things
  back exactly where they were.
