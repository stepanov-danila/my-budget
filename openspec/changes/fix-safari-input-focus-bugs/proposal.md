# Proposal

## Why

On iOS Safari, two input-focus related platform bugs make the amount editor
and the add-category form uncomfortable to use: the page zooms in whenever a
text field is focused (forcing the user to zoom back out every time), and a
button next to a just-used field sometimes needs two taps instead of one.

## What Changes

- Raise the font size of the app's real text inputs (the amount field's
  manual entry, the add-category name field) to at least 16px, the
  threshold below which iOS Safari auto-zooms the viewport on focus.
- Proactively blur the currently focused field when the user taps a
  confirm/submit button near it ("Готово" in the amount editor, "Добавить"
  in the add-category form), so the tap's click reaches the button on the
  first try instead of being consumed by Safari's own focus-dismissal step.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none — both are platform-event/styling fixes; no requirement text changes)

## Impact

- `src/components/AmountInput.tsx` — font-size of the `InputNumber`'s native
  input.
- `src/components/AddCategoryMenu.tsx` — font-size of the `Input`, and a
  blur-on-tap handler for the "Добавить" submit button.
- `src/components/AmountEditDialog.tsx` — blur-on-tap handler for the
  "Готово" button.
- No new dependencies; no API, data, or spec-level behavior changes — only
  CSS and an event handler to work around two iOS Safari quirks.
