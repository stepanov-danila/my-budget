## Context

Four independent UX fixes against the shipped app (see proposal.md - Why).
No new dependencies or data model changes; all four are implementation
adjustments to existing components/store actions.

## Goals / Non-Goals

**Goals:**
- Decouple "amount changed" from "list resorted" so editing doesn't jump
  the row the user is actively looking at.
- Make the slider-max growth rule predictable: only the slider's own edge
  grows it.
- Land the two smaller, self-contained fixes (step size, safe-area inset)
  alongside these without extra machinery.

**Non-Goals:**
- Reworking the amount-entry UI beyond the four specified behaviors.
- Persisting or restoring "in-progress edit" state across reloads - if the
  page reloads mid-edit, the store's last-committed order applies, same as
  today.

## Decisions

### Split sort out of `setCategoryAmount`
`useBudgetStore`'s `setCategoryAmount` currently sorts on every call, which
is what causes mid-edit reordering (Vitest/RTL didn't catch this because
the tests asserted on store state after each keystroke, not on visual
stability). Splitting into two store actions:
- `setCategoryAmount(monthId, categoryId, amount)`: updates the amount (and
  runs the adaptive-max check below) but leaves array order untouched.
- `resortCategories(monthId)`: re-sorts that month's categories by amount,
  descending.

`CategoryRow` wires `resortCategories` to the `onBlur` of both the number
and range inputs inside `AmountInput` (a new `onBlur` prop on
`AmountInput`, since it owns both controls). `addCategory` and
`restoreCategory` keep sorting immediately as before - those aren't
in-progress edits.

Alternative considered: debounce the resort while typing. Rejected -
debouncing still reorders unpredictably mid-edit (e.g. while the user is
still looking at row N, it jumps after the debounce fires), whereas blur
gives a single well-defined moment: the user has moved on.

### Adaptive max: exact-match only
Change the growth condition in `setCategoryAmount` from `amount >=
category.sliderMax` to `amount === category.sliderMax`. This is a
one-comparison-operator change; `nextSliderMax` (the rounding-up helper)
is unchanged. Confirmed with the user: a typed value that jumps past the
current max (e.g. 200,000 when the max is 50,000) still saves correctly,
it just doesn't drag the slider's visual range along with it - only
actually reaching the edge (by drag, or by typing the exact boundary
value) grows the range.

### Slider step: 1,000
`AmountInput`'s `SLIDER_STEP` constant changes from 100 to 1,000. This is
distinct from the store's `SLIDER_STEP = 50_000` (the max-growth rounding
block size), which is unrelated and unchanged - only the UI increment
changes.

### Safe-area padding
Add `pt-[env(safe-area-inset-top)]` (Tailwind arbitrary value, compiles to
`padding-top: env(safe-area-inset-top)`) to the app's root container in
`App.tsx`. `index.html` already sets `viewport-fit=cover`, which is what
makes the safe-area env() variables resolve to the device's actual inset
instead of 0; without it this class would be a no-op. Scoped to top only,
matching the reported symptom (status bar overlap) - bottom/side insets
aren't part of this change.

## Risks / Trade-offs

- [Risk] A user who drags the slider and never blurs the input (e.g.
  releases the pointer and immediately switches month tabs without
  clicking elsewhere) leaves that category's list position stale until
  something else focuses/blurs it → Mitigation: accepted per the explicit
  ask ("sort on blur"); the amount itself is still correct and live in the
  balance bar and chart, only the row's position in the list lags.
- [Risk] `env(safe-area-inset-top)` is 0 on devices/browsers without a
  safe-area concept (most desktop browsers, older mobile browsers) →
  Mitigation: `env()` with an unsupported var already falls back to 0
  per spec, so this is a no-op there, not a visual regression.

## Migration Plan

No data migration - purely client-side behavior/layout changes deployed via
the existing GitHub Pages workflow on merge to main.
