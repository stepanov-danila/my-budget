## 1. Project setup

- [x] 1.1 Scaffold a React + TypeScript + Vite app in the repo root and verify `npm run dev` serves a blank page
- [x] 1.2 Add Tailwind CSS (mobile-first config, `dark` class strategy) and verify a Tailwind utility class renders correctly in the dev server
- [x] 1.3 Add `vite-plugin-pwa` with `registerType: "autoUpdate"` and verify `npm run build` emits a manifest and service worker in the build output
- [x] 1.4 Add lint/format tooling (ESLint + Prettier or the project's preferred equivalent) and verify `npm run lint` passes on the scaffold

## 2. Data layer

- [x] 2.1 Define TypeScript types for `AppState`, `Month`, and `Category` per design.md's data model and verify the project type-checks
- [x] 2.2 Implement the `localStorage`-backed store (versioned key `my-budget:v1`) with read/write helpers and verify a unit test round-trips state through save/load
- [x] 2.3 Add the static default category constants (Expenses and Income lists from docs/spec.md) and verify a unit test asserts both lists' contents
- [x] 2.4 Wire the store as the single source of app state (e.g. Zustand store or context+reducer) and verify a smoke test reads and updates state through it

## 3. Month management

- [x] 3.1 Build the month tabs bar with horizontal scroll/swipe and active-month selection, and verify switching tabs changes the displayed month (per month-management spec: Switching active month)
- [x] 3.2 Implement "add month" flow with empty-start and carry-over-from-previous options, and verify both scenarios (per month-management spec: Create empty month, Create month copied from previous)
- [x] 3.3 Implement "delete month" with a blocking confirmation dialog and no Undo, and verify both confirm and cancel paths (per month-management spec: Confirmed deletion, Cancelled deletion)
- [x] 3.4 Build the sticky balance bar (income, expense, difference) for the active month and verify it stays visible while the category list scrolls and updates immediately on data change (per month-management spec: Always-visible month balance)
- [x] 3.5 Verify multiple months can coexist, each independently editable/deletable (per month-management spec: Multiple months supported)

## 4. Category management

- [x] 4.1 Build the Expenses/Income tab switch scoped to the active month and verify selecting a tab shows only that type's categories (per category-management spec: Expense/Income sections)
- [x] 4.2 Implement manual category creation (name input, zero starting amount) and verify the new category appears in the active month's list (per category-management spec: Manual category creation)
- [x] 4.3 Implement the default-category dropdown, filtered to exclude categories already in the active month, and verify selecting one adds it (per category-management spec: Selecting a default category, Default category already added)
- [x] 4.4 Implement amount-descending sort that recalculates on amount change or category addition and verify reordering and new-category insertion (per category-management spec: Reorder after amount change, New category insertion)
- [x] 4.5 Implement swipe-to-delete with an Undo toast (no confirmation dialog) and verify both the undo-restore and undo-expiry paths (per category-management spec: Delete then undo, Delete without undo)

## 5. Amount entry

- [x] 5.1 Build the synced manual-input + slider control for a category's amount and verify editing either updates the other (per amount-entry spec: Manual entry updates slider, Slider updates field)
- [x] 5.2 Set the default slider range (0-50,000, step 100) for new categories and verify it on category creation (per amount-entry spec: Fresh category default range)
- [x] 5.3 Implement the adaptive slider maximum (`ceil((value + 1) / 50000) * 50000`) for both typed overflow and right-edge drag, and verify both paths (per amount-entry spec: Typed value exceeds max, Dragged to edge)

## 6. Theme switching

- [ ] 6.1 Build the light/dark theme toggle control and verify toggling switches the rendered color scheme (per theme-switching spec: Switching to dark, Switching to light)
- [ ] 6.2 Persist the selected theme in the store and verify it is re-applied after a reload (per theme-switching spec: Reload after choosing dark)

## 7. Category charts

- [ ] 7.1 Add Recharts and build the category-breakdown chart for the active view (Expenses or Income) and verify it renders proportional shares (per category-charts spec: Viewing expense chart)
- [ ] 7.2 Handle the empty-categories state with a placeholder instead of an empty chart and verify it (per category-charts spec: No categories yet)
- [ ] 7.3 Verify the chart re-renders when categories are added, removed, or their amounts change (per category-charts spec: Chart reflects new category)

## 8. PWA shell

- [ ] 8.1 Configure the web app manifest (name, icons incl. maskable, theme/background colors, standalone display) and verify the app is installable from a mobile browser (per pwa-shell spec: Installing the app)
- [ ] 8.2 Verify the service worker caches static assets and the installed app loads and remains usable with the network disabled (per pwa-shell spec: Offline availability)

## 9. Final verification

- [ ] 9.1 Manually test the full flow end-to-end on a mobile viewport (or device emulation): create months, add/sort/delete categories, edit amounts via both input modes, toggle theme, view charts, install as PWA, and go offline
- [ ] 9.2 Run `openspec validate --change "monthly-budget-tracker" --strict` and verify it passes with no errors
