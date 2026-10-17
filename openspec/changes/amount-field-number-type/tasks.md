# Tasks

## 1. Switch the amount field to a native number input

- [ ] 1.1 Add `type="number"` to the `InputNumber` in `src/components/AmountInput.tsx`; verify by inspecting the rendered DOM (unit test or manual check) that the underlying `<input>` now has `type="number"`
- [ ] 1.2 Run the `amount-entry` unit tests and confirm every existing scenario (manual entry, slider sync, adaptive max, stepper buttons) still passes unchanged

## 2. Final verification

- [ ] 2.1 Run lint, typecheck, and the full unit/component test suite
- [ ] 2.2 Build the production bundle and run `node scripts/verify-full-flow.mjs` against it in real Chromium, confirming the amount-entry flow still works end to end
- [ ] 2.3 Run `openspec validate amount-field-number-type --strict` and confirm it passes with `skip_specs: true`

## Workflow follow-up

- Archive the change once all tasks above are checked off and verification is green.
- Verify the archived result (`openspec validate --specs --strict` still passes, since no main specs change).
