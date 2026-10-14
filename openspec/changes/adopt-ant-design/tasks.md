# Tasks

## 1. Add Ant Design and wire up app-level providers

- [x] 1.1 Add `antd` and `@ant-design/icons` to `package.json`; verify `npm install` succeeds and `npm run build` still produces a working bundle alongside the still-present Tailwind setup
- [x] 1.2 Wrap the app in AntD's `ConfigProvider` (theme algorithm driven by `useBudgetStore`'s `theme` field) and its `App` component in `src/main.tsx`/`src/App.tsx`; verify by rendering the app and toggling theme state in a test, confirming AntD's dark algorithm tokens are applied (e.g. via `theme.useToken()` or a rendered AntD component's computed background)

## 2. Theme switching on Ant Design

- [x] 2.1 Replace `ThemeToggle.tsx`'s custom button with an AntD `Switch` (sun/moon `@ant-design/icons`), wired to the existing `theme`/`toggleTheme` store fields, keeping its accessible name queryable the same way existing tests expect
- [x] 2.2 Remove the manual `.dark` class toggle on `documentElement` from `App.tsx` now that `ConfigProvider`'s algorithm drives theming
- [x] 2.3 Update `theme-switching`-related tests so "Switching to dark/light" and "Reload after choosing dark" scenarios pass against the `Switch` control

## 3. App shell and layout primitives

- [x] 3.1 Rebuild `App.tsx`'s root structure with AntD `Layout` / `Layout.Header` / `Layout.Content`, carrying the safe-area-inset-top padding over as an inline style on `Layout.Header` (same requirement as before, different styling mechanism)
- [x] 3.2 Update `AppHeader.tsx` to render inside `Layout.Header` using AntD `Typography`; verify `App.test.tsx`'s safe-area padding assertion still passes against the new structure
- [x] 3.3 Rebuild `BalanceBar.tsx` as a `position: sticky` bar using AntD `Statistic`/`Typography` for income/expense/difference; verify the existing "Balance stays visible while scrolling" and "Balance updates on data change" behavior still holds (balance test id/content still queryable)

## 4. Month management on Ant Design

- [x] 4.1 Replace `MonthTabs.tsx` with AntD `Tabs` (`type="line"`, one tab per month), confirming horizontal scroll works when tabs overflow; verify "Switching active month" scenario via existing/updated tests
- [x] 4.2 Replace `AddMonthMenu.tsx`'s custom sheet with a `Modal` offering the empty/carry-over choice, opened from the `Tabs`' `tabBarExtraContent`; verify "Create empty month" and "Create month copied from previous" scenarios
- [x] 4.3 Replace `ConfirmDialog.tsx` usage for month deletion with AntD `Modal.confirm`; verify "Confirmed deletion" and "Cancelled deletion" scenarios
- [x] 4.4 Update `month-management` tests and the month-management steps of `scripts/verify-full-flow.mjs` for the new `Tabs`/`Modal` selectors

## 5. Category management on Ant Design

- [x] 5.1 Replace `CategoryTypeTabs.tsx` with an AntD `Segmented` control for Expenses/Income; verify "Switching category type" scenario
- [x] 5.2 Replace `AddCategoryMenu.tsx`'s custom sheet with a `Modal` containing an `Input` (manual entry) and a `List`/`Select` of remaining default categories; verify "Manual category creation", "Selecting a default category", "Default category already added" scenarios
- [x] 5.3 Rebuild `CategoryRow.tsx` on AntD `List.Item` with an explicit delete action (`Button` + `DeleteOutlined`), removing the custom pointer-capture swipe gesture (`isInteractiveTarget`, drag refs) entirely; verify "Expense/Income sections", "Category list order" scenarios still hold with the new row markup
- [x] 5.4 Replace `UndoToast.tsx` with AntD `notification` (using its `btn` action for "Отменить"); verify "Delete then undo" and "Delete without undo" scenarios
- [x] 5.5 Update `category-management` tests and the category-management steps of `scripts/verify-full-flow.mjs` for the new `List`/`notification` selectors

## 6. Amount entry on Ant Design

- [x] 6.1 Rebuild `AmountInput.tsx` on AntD `Slider` + `InputNumber` (using `InputNumber`'s built-in steppers in place of the custom +/- buttons), porting the adaptive-slider-max growth logic to `Slider`'s `onChange`/`onChangeComplete` events; verify "Manual entry updates slider", "Slider updates field", "Fine-adjustment stepper buttons" scenarios
- [x] 6.2 Re-verify the adaptive-max logic ("Dragged to edge", "Typed value exceeds max", "Typed value exactly matches the max", "Growth does not cascade within one drag") against the new `Slider` event model with updated unit tests
- [x] 6.3 Rebuild `AmountEditDialog.tsx` on AntD `Modal` (centered by default); verify "Opening the amount editor", "Single amount display without duplication", "Closing the editor", "Dialog is centered on screen" scenarios
- [x] 6.4 Update `amount-entry` tests accordingly

## 7. Chart container

- [x] 7.1 Update `CategoryChart.tsx`'s surrounding container to AntD layout primitives, keeping Recharts for the chart itself; verify "Viewing expense chart", "No categories yet", "Chart reflects new category" scenarios still pass unchanged

## 8. Remove Tailwind

- [x] 8.1 Remove `tailwindcss` and `@tailwindcss/vite` from `package.json` and `vite.config.ts` once no component references a Tailwind utility class; verify with a repo-wide search for `className="` strings using Tailwind syntax and a clean `npm run build`
- [x] 8.2 Replace `src/index.css`'s Tailwind import and custom `dark` variant with `@import 'antd/dist/reset.css'` plus the minimal remaining global rules (body margin/font smoothing, `#root` min-height) as plain CSS; verify the app still renders correctly in a production build

## 9. Final verification and docs

- [x] 9.1 Run lint, typecheck, and the full unit/component test suite; fix any remaining failures
- [x] 9.2 Build the production bundle and run `node scripts/verify-full-flow.mjs` against it in real Chromium, confirming every existing scenario in the flow still passes
- [x] 9.3 Update `docs/spec.md` section 12 ("Технологический ориентир") to name Ant Design as the UI component library
- [x] 9.4 Run `openspec validate adopt-ant-design --strict` and confirm it passes with `skip_specs: true`

## Workflow follow-up

- Archive the change once all tasks above are checked off and verification is green.
- Verify the archived result (`openspec validate --specs --strict` still passes, since no main specs change).
