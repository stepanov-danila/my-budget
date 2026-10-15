# Proposal

## Why

The app header (title + manual light/dark toggle) adds a UI element and a
decision the user doesn't need to make: on a phone, the OS already knows
whether the user wants light or dark, and the app currently makes them
pick again. Removing the toggle (and the now-empty header around it) also
frees the top of the screen to become the safe-area spacer that keeps
content clear of the status bar/notch, which the app currently needs the
header for.

## What Changes

- **BREAKING**: The theme toggle control is removed entirely. The app no
  longer offers a way to manually pick light/dark - it always follows the
  OS/browser's `prefers-color-scheme`, including updating live if the user
  changes their system setting while the app is open (no reload needed).
- **BREAKING**: The app header (title "Мой бюджет" + toggle) is removed.
  The space it occupied becomes a blank, safe-area-padded spacer at the
  top of the screen - no visible content, just enough height to clear a
  device's notch/status bar in standalone PWA mode.
- The previously persisted theme choice (`theme` field in the stored
  `AppState`) is dropped - there is nothing to persist once the theme is
  never chosen, only read from the OS.
- The sticky balance bar becomes the first visible UI element on screen,
  below the blank spacer.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `theme-switching`: replaces "manually toggle and persist a theme
  choice" with "always follow the OS/browser color-scheme preference,
  live". The capability's purpose shifts from letting the user choose to
  letting the OS choose.
- `pwa-shell`: the "Safe-area aware layout" requirement's scenario changes
  from "header and sticky balance bar are padded clear of the safe area"
  to "a blank top spacer and the sticky balance bar are padded clear of
  the safe area" - same guarantee, no header to pad anymore.

## Impact

- `src/store/useBudgetStore.ts`: remove `theme`/`setTheme`/`toggleTheme`
  from `AppState`/`BudgetActions`; theme becomes a derived value, not
  stored or persisted.
- `src/App.tsx`: remove `AppHeader`, replace `Layout.Header` with a blank
  safe-area spacer; theme now read via a live `prefers-color-scheme`
  listener feeding AntD's `ConfigProvider`.
- Removed: `src/components/AppHeader.tsx`, `src/components/ThemeToggle.tsx`.
- `src/lib/storage.ts` / `src/types.ts`: `AppState` shape loses the `theme`
  field; existing persisted data without a stored theme is unaffected
  (the field is simply no longer read or written).
- Tests: `src/features/theme-switching.test.tsx`, `src/App.test.tsx`, and
  the theme-switching/safe-area steps of `scripts/verify-full-flow.mjs`
  are rewritten for OS-driven theme and the new blank-spacer layout.
- `docs/spec.md` sections 4 (header mention, if any) and 8 (theme) updated
  to describe OS-driven theme instead of a manual toggle.
