# Proposal

## Why

The app's UI is currently hand-built with Tailwind utility classes and a
handful of bespoke components (custom modals, a custom slider wrapper,
custom tabs, a hand-rolled swipe-to-delete gesture). Every new interaction
pattern has to be designed and built from scratch, and keeping it visually
and behaviorally consistent (focus states, tap targets, dialog centering,
accessibility roles) is manual, ongoing work. Adopting Ant Design (`antd`)
replaces this bespoke layer with a mature, accessible component library,
cutting the custom-component surface the project has to maintain.

## What Changes

- **BREAKING (visual)**: Full UI rebuild on Ant Design, adopting its
  default look (palette, type scale, spacing, border radius, light/dark
  theme) rather than preserving the app's current custom visual identity.
  The app will look like a standard Ant Design app, not like it does today.
- Layout is rebuilt with AntD's `Layout`, `Grid`/`Row`/`Col`, and `Space`
  components in place of Tailwind flex/grid utility classes, wherever AntD
  provides the equivalent. Tailwind is removed once nothing depends on it.
- Component-by-component replacements:
  - Month tabs → AntD `Tabs` (scrollable, horizontal)
  - Add/delete month and category dialogs, amount editor popup → AntD
    `Modal`
  - Amount slider + manual field + steppers → AntD `Slider` + `InputNumber`
  - Default-category picker → AntD `Select` or `List` inside the existing
    `Modal`
  - Category list + swipe-to-delete → AntD `List` with an explicit delete
    action (icon button); the custom pointer-drag swipe gesture is removed
    in favor of a tappable action, since no requirement mandates swipe
    specifically, only "a quick action, without a confirmation dialog"
  - Month-delete confirmation → AntD `Modal.confirm` (or `Popconfirm`)
  - Undo toast → AntD `message`/`notification`
  - Theme toggle → AntD `Switch`, driven by AntD's `ConfigProvider`
    `theme.algorithm` (`defaultAlgorithm` / `darkAlgorithm`) instead of a
    hand-maintained `dark` class and custom dark-mode Tailwind variants
  - Buttons, inputs, text → AntD `Button`, `Input`, `Typography`
- The category breakdown chart keeps using Recharts (not a UI-chrome
  component, and AntD does not ship charting in its core package); only
  its surrounding container moves to AntD layout primitives.
- No functional/behavioral change: every existing requirement (slider
  sync and adaptive range, stepper buttons, amount popup, stable category
  order with position-preserving Undo, month tabs/add/delete, pinned
  balance, theme persistence, offline PWA shell, safe-area padding) is
  preserved - only the component library and visual skin implementing them
  changes. Existing `aria-label`s and test ids that existing tests and
  `scripts/verify-full-flow.mjs` depend on are preserved so behavior stays
  independently verifiable before and after.

## Capabilities

No capability requirements change - every existing behavior (listed above)
is preserved; only the implementation (component library) and visual
presentation change. `skip_specs: true` is set in this change's
`.openspec.yaml` accordingly.

### New Capabilities
(none)

### Modified Capabilities
(none - see Why/What Changes; this is a presentation-layer/technical
change, not a behavior change)

## Impact

- `package.json`: add `antd` (and `@ant-design/icons` for action icons);
  remove `tailwindcss`, `@tailwindcss/vite`, and the project's Tailwind
  config/CSS once no component still depends on utility classes.
- Every component under `src/components/` is rewritten against AntD:
  `AppHeader`, `MonthTabs`, `AddMonthMenu`, `ConfirmDialog`,
  `CategoryTypeTabs`, `AddCategoryMenu`, `CategoryRow`, `AmountInput`,
  `AmountEditDialog`, `UndoToast`, `BalanceBar`, `CategoryChart` (container
  only), `ThemeToggle`.
- `src/App.tsx` and `src/main.tsx`: wrap the app in AntD's `ConfigProvider`
  (theme algorithm driven by the existing theme store) and `App` component
  (for `message`/`notification` context).
- `src/index.css`: drop Tailwind's `@import`/directives once the last
  Tailwind-only class is removed; AntD's own CSS baseline takes over.
- Test suite (`src/**/*.test.tsx`) and `scripts/verify-full-flow.mjs`:
  unchanged in intent, but selectors may need light touch-ups for any
  control whose DOM structure AntD renders differently than its original
  implementation (e.g., AntD's `Slider` and `InputNumber` wrap the native
  input differently); `aria-label`s are kept stable so most queries by
  accessible name keep working unchanged.
- `docs/spec.md`: section 12 ("Технологический ориентир") updated to name
  Ant Design as the component library.
