# Tasks

## 1. Prevent iOS zoom-on-focus for text inputs

- [x] 1.1 Set the manual amount field's native input to at least 16px font
      size (`AmountInput.tsx`'s `InputNumber`) and verify with a rendered
      test that its computed/inline font-size is >= 16px
- [x] 1.2 Set the add-category name field's native input to at least 16px
      font size (`AddCategoryMenu.tsx`'s `Input`) and verify with a
      rendered test that its computed/inline font-size is >= 16px

## 2. Make the nearby confirm button respond to the first tap

- [x] 2.1 Add a pointerdown handler on the "Готово" button in
      `AmountEditDialog.tsx` that blurs `document.activeElement` before the
      click proceeds, and verify with a test that clicking it while the
      manual field has focus both blurs that field and still invokes
      `onClose`
- [x] 2.2 Add the same pointerdown-blur handling to the "Добавить" submit
      button in `AddCategoryMenu.tsx`, and verify with a test that clicking
      it while the name field has focus both blurs that field and still
      submits the new category

## 3. Verification

- [x] 3.1 Run lint, typecheck, and the full unit suite; verify all pass
- [x] 3.2 Rebuild the production bundle and re-run the Playwright
      iPhone-emulation check used for the numeric-keyboard fix, opening
      both the amount editor and the add-category dialog, and verify the
      manual field's and name field's computed font-size is >= 16px in the
      built output

## Workflow follow-up

- Archive the change (no specs to sync — `skip_specs: true`) once tasks 1-3
  are done.
- Deploy per the established pattern (push to `claude/openspec-setup-mjvz8f`
  and to `main`) once archived.
- Ask the user to confirm on an actual iPhone/Safari that the zoom and
  first-tap issues are gone — Playwright can emulate viewport/UA but not
  Safari's real zoom-on-focus or tap-timing behavior.
