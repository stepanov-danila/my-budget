# Tasks

## 1. Live system-theme hook

- [ ] 1.1 Add `src/hooks/useSystemTheme.ts` returning the current `Theme`, backed by `window.matchMedia('(prefers-color-scheme: dark)')` and subscribing to its `change` event for live updates; verify with a unit test asserting the initial value and that a simulated `change` event updates the returned value
- [ ] 1.2 Wire `App.tsx`'s `ConfigProvider` to `useSystemTheme()` instead of `useBudgetStore`'s `theme` field; verify "Launching with a system theme" and "System theme changes while the app is open" scenarios via `theme-switching` tests

## 2. Remove the manual theme toggle and header

- [ ] 2.1 Delete `src/components/ThemeToggle.tsx` and `src/components/AppHeader.tsx`; remove their imports/usages from `App.tsx`
- [ ] 2.2 Remove `Layout.Header` from `App.tsx` and move its safe-area `paddingTop` onto `Layout.Content`; rename `SAFE_AREA_HEADER_STYLE` to `SAFE_AREA_TOP_STYLE` in `src/constants/layout.ts`, dropping the now-unneeded `height`/`lineHeight` properties; verify `App.test.tsx`'s safe-area assertion passes against `getByRole('main')`
- [ ] 2.3 Update `theme-switching` tests to drop every toggle/`ThemeToggle` interaction (`getByLabelText('Включить тёмную/светлую тему')`) and instead assert against `useSystemTheme`/a mocked `matchMedia`

## 3. Drop persisted theme from the store

- [ ] 3.1 Remove `theme`, `setTheme`, `toggleTheme`, and `detectPreferredTheme` from `src/store/useBudgetStore.ts`; remove `theme` from `AppState` in `src/types.ts` (keep the `Theme` type itself, now used by `useSystemTheme`)
- [ ] 3.2 Update `src/store/useBudgetStore.test.ts` to drop theme-related assertions and the `saveState` call in the store's `subscribe` to no longer include `theme`; verify the full unit/component suite passes

## 4. Update E2E script and docs

- [ ] 4.1 Update the theme-switching and safe-area steps of `scripts/verify-full-flow.mjs`: drive the system color scheme via Playwright's `page.emulateMedia({ colorScheme: 'dark' })` instead of clicking a toggle, and query the safe-area padding via the new `main` landmark
- [ ] 4.2 Update `docs/spec.md` section 8 ("Тема оформления") to describe OS-driven, live theme instead of a manual toggle, and section 4/wherever the header is mentioned to describe the blank safe-area spacer instead

## 5. Final verification

- [ ] 5.1 Run lint, typecheck, and the full unit/component test suite; fix any remaining failures
- [ ] 5.2 Build the production bundle and run `node scripts/verify-full-flow.mjs` against it in real Chromium (using `page.emulateMedia` to flip the color scheme), confirming the app follows system theme live and the safe-area gap still clears the status bar/notch
- [ ] 5.3 Run `openspec validate remove-header-follow-system-theme --strict` and confirm it passes

## Workflow follow-up

- Sync the `theme-switching` and `pwa-shell` delta specs to main specs and archive the change once all tasks above are checked off and verification is green.
- Verify the archived result (`openspec validate --specs --strict` still passes).
