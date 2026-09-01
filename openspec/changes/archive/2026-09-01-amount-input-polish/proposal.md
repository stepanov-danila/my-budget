## Why

Follow-up feedback after the last UX pass: the default category list is too
thin for real use, a single continuous slider drag can grow the amount
range by more than the intended one step (feels like a huge jump), and the
slider alone is too imprecise on a touchscreen to land on an exact amount.

## What Changes

- Add five more default expense categories (Кредиты, Аренда, Такси,
  Домашние животные, Спорт) and add Аренда to the default income list too
  (covers rental income, not just rent paid).
- Guard the adaptive slider-max growth so a single continuous drag gesture
  can only trigger one growth step, even if the browser re-evaluates the
  slider's position against the newly-grown range while the same drag is
  still active - growth stays at exactly one step (50,000 RUB) per
  gesture instead of potentially compounding.
- Add increment/decrement buttons next to the manual amount field, stepping
  by the same 1,000 RUB the slider uses, so an exact value can be reached
  without depending on drag precision.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `amount-entry`: "Adaptive slider maximum" gets a no-cascade-per-gesture
  clarification; adds a new "Fine-adjustment stepper buttons" requirement.

## Impact

- Affected code: `src/constants/categories.ts` (content only, no spec
  delta - the default lists aren't spec'd by name), `docs/spec.md` section
  6 (keep the source doc in sync), `src/components/AmountInput.tsx`
  (drag-guard ref, stepper buttons), `src/store/useBudgetStore.ts` (no
  change expected - the growth math is already correct per-call; the
  cascade only happens across multiple calls within one drag, which is a
  component-level concern).
- No new dependencies, no data model changes.
