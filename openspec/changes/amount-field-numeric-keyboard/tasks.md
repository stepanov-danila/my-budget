# Tasks

## 1. Switch the amount field to a reliable numeric keypad

- [x] 1.1 In `src/components/AmountInput.tsx`, remove `type="number"` from the `InputNumber` and add `inputMode="numeric"`; verify by inspecting the rendered DOM (unit test) that the underlying `<input>` has `type="text"` and `inputMode="numeric"`
- [x] 1.2 Run the `amount-entry` unit tests and confirm every existing scenario (manual entry, slider sync, adaptive max, stepper buttons) still passes unchanged

## 2. Final verification

- [x] 2.1 Run lint, typecheck, and the full unit/component test suite
- [x] 2.2 Build the production bundle and run `node scripts/verify-full-flow.mjs` against it in real Chromium, confirming the amount-entry flow still works end to end
- [x] 2.3 Run `openspec validate amount-field-numeric-keyboard --strict` and confirm it passes with `skip_specs: true`

## Workflow follow-up

- Archive the change once all tasks above are checked off and verification is green.
- Verify the archived result (`openspec validate --specs --strict` still passes, since no main specs change).
