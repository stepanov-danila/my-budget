# Design

## Context

See `proposal.md` - Why / What Changes for motivation and scope. Today the
UI is Tailwind utility classes plus bespoke components: `ConfirmDialog`,
`AddMonthMenu`, `AddCategoryMenu`, `AmountEditDialog` (custom bottom-sheet
patterned modals), `AmountInput` (raw `<input type="range">` with manual
pointer-event tracking for the adaptive-slider-max cascade guard),
`MonthTabs`/`CategoryTypeTabs` (custom tab bars), `CategoryRow` (custom
pointer-based swipe-to-delete), `UndoToast` (custom toast), `ThemeToggle`
(custom button toggling a `dark` class on `documentElement`, paired with
hand-written Tailwind `dark:` variants everywhere). The theme store
(`useBudgetStore`'s `theme`/`toggleTheme`) and all business logic
(`useBudgetStore.ts`, `types.ts`, `lib/storage.ts`, `constants/categories.ts`)
are UI-framework-agnostic and are not touched by this change.

Existing tests (`src/**/*.test.tsx`) and `scripts/verify-full-flow.mjs`
query controls by `aria-label`, role, and text content - these are the
contract this design preserves wherever AntD's component API allows it.

## Goals / Non-Goals

**Goals:**
- Replace every bespoke UI component with its Ant Design equivalent,
  adopting AntD's default visual design (palette, spacing, radius,
  light/dark algorithm) rather than reproducing the current custom look.
- Preserve 100% of existing behavior described in the specs (see
  proposal.md - Capabilities: no requirement changes) - only the
  component library and visual skin change.
- Remove Tailwind (`tailwindcss`, `@tailwindcss/vite`) and all custom
  component CSS once no component depends on it, in this same change
  (not staged across multiple changes), per the chosen "one big change"
  strategy.
- Keep `aria-label`s and accessible roles stable so existing tests need at
  most light touch-ups, not rewrites, and `scripts/verify-full-flow.mjs`
  keeps verifying the same user journeys end to end.

**Non-Goals:**
- No change to `useBudgetStore.ts` business logic (sorting/order,
  adaptive slider-max math, Undo index-preservation, month/category data
  shape) - only how it is rendered and wired to events.
- No change to the chart library - `category-charts` keeps using
  Recharts; AntD does not ship charting in its core package, and the
  proposal already scopes the chart's container (not its internals) into
  the AntD layout.
- No new features beyond what today's components already do.
- No offline/PWA behavior change - `vite-plugin-pwa` config, manifest, and
  safe-area handling are unaffected by the component library swap.

## Decisions

- **Theming via `ConfigProvider`**: wrap the app in AntD's `ConfigProvider`
  with `theme.algorithm` set to `theme.defaultAlgorithm` or
  `theme.darkAlgorithm` based on `useBudgetStore`'s `theme` field, replacing
  the current manual `.dark` class toggle on `documentElement` and all
  hand-written `dark:` Tailwind variants. Also wrap the tree in AntD's
  `App` component (`import { App } from 'antd'`), which provides the
  React context `message`/`notification`/`Modal.useModal` need - without
  it, those static-looking APIs render outside AntD's theme and silently
  ignore the dark algorithm.
  *Alternative considered*: keep the manual `dark` class and write custom
  CSS overrides for AntD's classes. Rejected - fights the library instead
  of using its own theming seam, and does not satisfy "adopt AntD's
  default look."
- **Layout**: `Layout` + `Layout.Header` (app header) + `Layout.Content`
  (scrollable body) replace the current plain `div` structure. The
  safe-area top padding currently required by `pwa-shell`'s "Safe-area
  aware layout" requirement moves from a Tailwind arbitrary-value class to
  an inline style (`paddingTop: 'env(safe-area-inset-top)'`) on
  `Layout.Header` - unrelated to the component library, must be carried
  over exactly as-is.
- **Month tabs**: AntD `Tabs` (`type="line"`), one tab per month, with
  the "add month" affordance in `tabBarExtraContent`, opening a `Modal`
  with the empty/carry-over choice (replacing `AddMonthMenu`'s custom
  sheet). AntD `Tabs` scrolls its tab bar horizontally when it overflows,
  satisfying "switch between via horizontal scroll or swipe" without
  custom code.
- **Month delete confirmation**: AntD `Modal.confirm` (danger-styled),
  satisfying "Delete month with confirmation" as-is (confirm/cancel
  scenarios map directly onto `Modal.confirm`'s `onOk`/`onCancel`).
- **Pinned balance bar**: kept pinned via CSS `position: sticky` (simplest
  correct fit for "stays visible while scrolling"); AntD's `Affix`
  component was considered but adds scroll-container coupling this single
  bar doesn't need.
- **Expense/Income switch**: AntD `Segmented` instead of a second `Tabs`
  instance - a closer default-AntD fit for a fixed two-option switch than
  nested `Tabs`, and avoids two different things both being named "tabs"
  in the accessibility tree.
- **Add-category menu**: `Modal` containing an `Input` (manual name) and
  a `List` (or `Select`) of remaining default categories, replacing
  `AddCategoryMenu`'s custom sheet one-for-one.
- **Category list and delete**: AntD `List` with `List.Item`
  `actions={[<Button icon={<DeleteOutlined />} />]}` replaces the custom
  pointer-capture swipe gesture (`isInteractiveTarget`, drag-position
  refs) entirely. No requirement mandates swipe - "Delete category with
  Undo" only requires "a quick action, without a confirmation dialog" -
  so a direct, always-visible delete icon satisfies it and removes a
  whole class of custom gesture code (and the swipe/click conflict this
  project hit once before, see `category-management`'s prior bug fixes).
- **Undo surface**: AntD `notification` (not `message`) for the
  "category deleted" toast, because `notification.open` supports a `btn`
  action element - needed for the "Отменить" action - while `message`
  does not. Matches "Delete then undo" / "Delete without undo" scenarios
  unchanged (same timed window, just a different rendering primitive).
- **Amount editor popup**: AntD `Modal` (centered by default - already
  matches the shipped "Dialog is centered on screen" requirement with no
  extra work) containing AntD `Slider` + `InputNumber`. `InputNumber`
  ships its own up/down stepper controls, so it can satisfy "Fine-
  adjustment stepper buttons" directly instead of pairing a plain
  `<input type="number">` with two hand-built buttons.
  The adaptive-slider-max business logic (grow only on an exact-match
  reach, no more than once per continuous drag) stays as pure logic in
  `useBudgetStore`/a small hook, but its *trigger* moves from manually
  tracked `pointerdown`/`pointerup` on a raw range input to AntD
  `Slider`'s `onChange` (continuous, for the live field/slider sync) and
  `onChangeComplete` (fires once when a drag/keyboard-adjustment gesture
  ends) - `onChangeComplete` is a more direct signal for "this gesture is
  over" than manually tracked pointer events, and should let the
  cascade-guard logic become simpler, not just differently wired.
- **Theme toggle control**: AntD `Switch` with sun/moon `@ant-design/icons`,
  wired to the existing `theme`/`toggleTheme` store fields - no store
  change, only the control's rendering.
- **Tailwind removal**: drop `tailwindcss` and `@tailwindcss/vite` from
  `package.json` and `vite.config.ts`; replace `src/index.css`'s
  `@import 'tailwindcss'` and the custom `dark` variant with
  `@import 'antd/dist/reset.css'` plus the minimal global rules that
  aren't component-specific (body margin, font smoothing, `#root` min
  height) rewritten as plain CSS.
- **Dependencies**: add `antd` and `@ant-design/icons`. Keep `recharts`
  for the chart (see Non-Goals).

## Risks / Trade-offs

- [Risk] A half-migrated state (some components AntD, some still
  Tailwind) would look visually broken. → Mitigation: ship Tailwind's
  removal in the same change as the last component migrated, per the
  chosen "one big change" strategy; the task breakdown still migrates one
  feature area at a time internally so each area can be verified before
  moving to the next, but nothing merges half-done.
- [Risk] Removing the custom swipe-to-delete gesture is a user-visible
  interaction change (tap an icon instead of swiping). → Mitigation:
  called out explicitly in the proposal; still satisfies every existing
  "Delete category with Undo" scenario, and removes a prior source of
  real bugs (swipe/click pointer-capture conflict fixed earlier in this
  project).
- [Risk] AntD `Slider`'s event model differs enough from a raw
  `<input type="range">` that the adaptive-max cascade guard could
  regress under real touch input. → Mitigation: re-run
  `scripts/verify-full-flow.mjs` against a real Chromium build after the
  amount-entry area is migrated, specifically re-exercising drag-to-edge
  growth and single-growth-per-gesture.
- [Risk] AntD components render different internal DOM than today's plain
  `<input>`/`<button>` elements, so some `getByLabelText`/`getByRole`
  queries in existing tests may need their target element adjusted (same
  accessible name, different underlying node). → Mitigation: pass
  `aria-label` explicitly through to each AntD control's underlying input
  (`Slider`, `InputNumber`, `Switch` all accept it) so accessible names
  stay identical; expect to touch up queries, not rewrite test intent.
- [Risk] Bundle size grows from adding a full component library. →
  Mitigation: AntD v5 ships ES modules and tree-shakes under Vite without
  extra tooling; verify with `npm run build` output size as part of
  final verification, no separate action planned unless it regresses
  badly.

## Migration Plan

No data migration - this is presentation-layer only; `localStorage`'s
persisted `AppState` shape (`lib/storage.ts`, `types.ts`) is untouched, so
existing users' saved months/categories/theme load unchanged under the
new UI.
