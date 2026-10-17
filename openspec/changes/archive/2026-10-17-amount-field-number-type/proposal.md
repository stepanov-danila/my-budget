# Proposal

## Why

The amount editor's manual field is an AntD `InputNumber`, which by
default renders its underlying native `<input>` as `type="text"` (AntD
keeps this as the default so it can own formatting/parsing). On a phone
that means the field doesn't reliably bring up the device's numeric
keypad, and the input isn't marked up as a number the way it behaves.

## What Changes

- The amount manual-entry field's underlying native `<input>` is switched
  to `type="number"` (AntD `InputNumber` supports this via its own `type`
  prop), so mobile browsers show a numeric keypad and the field's HTML
  semantics match what it actually is.
- No behavior change: typing, the slider sync, the adaptive-max logic,
  and the stepper buttons all work exactly as before - only the
  underlying input element's `type` attribute changes.

## Capabilities

No capability requirements change - `amount-entry`'s spec describes
syncing a manual field with a slider, not the manual field's native HTML
input type. `skip_specs: true` is set in this change's `.openspec.yaml`
accordingly.

### New Capabilities
(none)

### Modified Capabilities
(none)

## Impact

- `src/components/AmountInput.tsx`: add `type="number"` to the
  `InputNumber` component.
