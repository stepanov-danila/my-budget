# Tasks

## 1. Cover the amount editor's stepper buttons

- [ ] 1.1 Add `onPointerDown={blurActiveElement}` to the "Уменьшить сумму"
      and "Увеличить сумму" buttons in `AmountInput.tsx`, and verify with a
      test that clicking either one, while the manual field or slider
      handle has focus, blurs it before the click's amount change takes
      effect

## 2. Cover the add-category dialog's default-option buttons

- [ ] 2.1 Add `onPointerDown={blurActiveElement}` to the default-category
      option buttons rendered by `AddCategoryMenu.tsx`'s list, and verify
      with a test that clicking one while the name field has focus blurs
      it before the click adds the category

## 3. Verification

- [ ] 3.1 Run lint, typecheck, and the full unit suite; verify all pass

## Workflow follow-up

- Archive the change (no specs to sync — `skip_specs: true`) once tasks
  1-3 are done.
- Deploy per the established pattern (push to `claude/openspec-setup-mjvz8f`
  and to `main`) once archived.
