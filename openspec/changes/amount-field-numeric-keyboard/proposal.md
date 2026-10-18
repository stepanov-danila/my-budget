# Proposal

## Why

A previous change (`amount-field-number-type`) switched the amount
manual-entry field's native `<input>` to `type="number"`, expecting
phones to show a numeric keypad. In practice `type="number"` alone
doesn't guarantee that: iOS Safari in particular shows a "Numbers and
Punctuation" keyboard for it (decimal point, comma, and other symbols
alongside the digits), not a pure digit pad. The reliable, cross-platform
way to force a digits-only keypad is the `inputMode` attribute, which
browsers consult specifically for keyboard selection.

## What Changes

- The amount manual-entry field's underlying native `<input>` drops
  `type="number"` and instead uses `type="text"` with `inputMode="numeric"`.
  `numeric` (not `decimal`) matches the field's actual value domain:
  amounts are always whole rubles (step 1,000, no fractional input).
- No behavior change: typing, the slider sync, the adaptive-max logic,
  and the stepper buttons all work exactly as before - only the
  underlying input element's `type`/`inputMode` attributes change.

## Capabilities

No capability requirements change - `amount-entry`'s spec describes
syncing a manual field with a slider, not the manual field's native HTML
input type or keyboard hint. `skip_specs: true` is set in this change's
`.openspec.yaml` accordingly.

### New Capabilities
(none)

### Modified Capabilities
(none)

## Impact

- `src/components/AmountInput.tsx`: remove `type="number"` from the
  `InputNumber`, add `inputMode="numeric"`.
