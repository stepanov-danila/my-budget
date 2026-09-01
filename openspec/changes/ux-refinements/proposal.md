## Why

Real usage of the deployed app surfaced four UX rough edges: the category
list reorders mid-keystroke/mid-drag instead of settling once editing is
done, the amount slider's max grows too eagerly (on any value beyond it,
not just when the slider is actually driven to its edge), the slider's
step is too fine-grained for quick adjustment, and the installed PWA's top
UI renders under the phone's status bar (clock/signal/battery) because
nothing accounts for the device's safe-area inset.

## What Changes

- **BREAKING** (behavior, not API): category re-sorting now happens when
  the amount field loses focus (blur), not on every keystroke or slider
  drag tick. The list order stays stable while a field is actively being
  edited.
- The amount slider's maximum now grows only when the amount exactly
  equals the current maximum (typically by dragging to the right edge).
  Typing a value that jumps past the maximum without landing on it exactly
  no longer grows the slider - the amount still saves correctly, the
  slider just visually caps at its current maximum until it's driven to
  that edge.
- The slider's step changes from 100 to 1,000 RUB.
- The app's top-level layout now respects `env(safe-area-inset-top)` so
  the header and sticky balance bar clear the status bar in standalone PWA
  mode on notched/status-bar devices.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `category-management`: the "Categories sorted by amount" requirement now
  defers reordering to blur instead of every amount change.
- `amount-entry`: the "Default slider range" requirement's step changes to
  1,000; the "Adaptive slider maximum" requirement now grows only on an
  exact match instead of on any value at or above the current maximum.
- `pwa-shell`: adds a requirement that standalone-mode layout respects the
  device's safe-area insets.

## Impact

- Affected code: `src/store/useBudgetStore.ts` (split sort out of
  `setCategoryAmount`, add a resort action, exact-match growth check),
  `src/components/AmountInput.tsx` (step constant, blur propagation),
  `src/components/CategoryRow.tsx` (wire blur to resort), `src/App.tsx` or
  `src/index.css` (safe-area padding).
- No new dependencies. No data model changes.
- Existing component tests that assert immediate reordering on amount
  change, or slider-max growth on any excess value, need updating to match
  the new contracts.
