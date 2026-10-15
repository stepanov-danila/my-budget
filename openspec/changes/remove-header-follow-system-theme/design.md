# Design

## Context

See `proposal.md` - Why / What Changes for motivation. Today `App.tsx`
renders `Layout.Header` (padded for the safe-area top inset) containing
`AppHeader` (title + `ThemeToggle`). Theme lives in `useBudgetStore`'s
`AppState.theme`, initialized once from `prefers-color-scheme` via
`detectPreferredTheme()` only when there's no persisted value, then
switched by `toggleTheme`/`setTheme` and persisted to `localStorage`
through the store's `subscribe` callback in `lib/storage.ts`. `ConfigProvider`
in `App.tsx` reads that store field to pick `antdTheme.darkAlgorithm` vs
`defaultAlgorithm`.

## Goals / Non-Goals

**Goals:**
- Theme is always derived live from `prefers-color-scheme`, reacting
  immediately if the user changes their OS/browser setting while the app
  is open - no app restart or manual action needed.
- No UI control remains for picking a theme, and no theme value is
  persisted - it's recomputed from the OS/browser on every load.
- The vertical space the header used to occupy becomes a non-interactive,
  safe-area-padded gap; everything else (month tabs, balance bar,
  category list) shifts up into what was previously `Layout.Content`.

**Non-Goals:**
- No change to how the safe-area inset itself is computed (still
  `env(safe-area-inset-top)`) - only to which element carries that padding
  and that it no longer wraps any header content.
- No change to any other store field, action, or persisted shape beyond
  removing `theme`.

## Decisions

- **Live system theme via a small hook, not the store**: add
  `src/hooks/useSystemTheme.ts` returning the current `Theme`, backed by
  `window.matchMedia('(prefers-color-scheme: dark)')` and subscribing to
  its `change` event for the lifetime of the component tree. `App.tsx`
  calls this hook directly to drive `ConfigProvider`'s algorithm, instead
  of reading `theme` from `useBudgetStore`.
  *Alternative considered*: keep `theme` in the store and have the store
  subscribe to the media query itself. Rejected - theme is no longer
  app/business state that other code depends on (nothing else reads it),
  so it doesn't belong in `useBudgetStore`; a local hook is the smaller,
  more obviously side-effect-scoped home for it.
- **Drop `theme` from `AppState` entirely**: remove the field from
  `types.ts`'s `AppState`, from `loadInitialState`/the initial object
  literal, and from the object passed to `saveState` in the store's
  `subscribe` callback. `detectPreferredTheme()` is deleted from the store
  (superseded by the hook's own detection). The `Theme` type itself stays
  in `types.ts`, now used only by the new hook.
  *Migration note*: existing persisted `localStorage` data may still
  contain a `theme` key from before this change. That's harmless - the
  updated `AppState` type simply never reads it, and the next `saveState`
  call (on any other state change) overwrites the stored JSON without it.
- **Remove `AppHeader.tsx` and `ThemeToggle.tsx`**: both are deleted
  outright rather than emptied out, since neither has any remaining
  purpose (no title row, no toggle control).
- **Blank spacer via padding, not a dedicated empty element**: drop
  `Layout.Header` and move its safe-area `paddingTop` directly onto
  `Layout.Content` (which already renders a semantic `<main>`). This
  keeps the same visual gap at the top without introducing an empty
  wrapper purely to hold padding. The existing `SAFE_AREA_HEADER_STYLE`
  constant in `src/constants/layout.ts` is renamed `SAFE_AREA_TOP_STYLE`
  and trimmed to just the padding properties (no `height`/`lineHeight`,
  which only existed to normalize `Layout.Header`'s own default sizing).
- **Test target for the safe-area assertion**: `App.test.tsx` currently
  queries `getByRole('banner')` (the removed `<header>`). It switches to
  `getByRole('main')` (AntD `Layout.Content`'s semantic element) and keeps
  asserting against the exported style constant, for the same jsdom
  `env()`-parsing reason recorded in that constant's existing comment.

## Risks / Trade-offs

- [Risk] jsdom's `matchMedia` mock in `src/test/setup.ts` is a static,
  non-reactive stub (`matches: false`, no-op `addEventListener`), so the
  new "theme changes live while open" scenario can't be exercised through
  that shared mock. → Mitigation: that one test installs its own local
  `window.matchMedia` mock (capturing the registered `change` listener so
  the test can invoke it directly), scoped to itself, instead of changing
  the shared setup file other tests rely on.
- [Risk] Removing the only visible "Мой бюджет" app title means the app
  has no in-UI branding at all. → Mitigation: out of scope per the user's
  explicit request; the PWA manifest's `name`/`short_name` still carry the
  app's identity on the home screen and in the OS app switcher.

## Migration Plan

No data migration needed - `months`/`activeMonthId` persisted shape is
unaffected; a leftover `theme` key in existing `localStorage` data is
simply ignored going forward (see Decisions above).
