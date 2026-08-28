## Why

The repo currently has no application at all - just a placeholder README. The
user wants a personal, offline, mobile-first monthly budget tracker that
shows income vs. expense at a glance, based on the requirements gathered in
`docs/spec.md`.

## What Changes

- New single-user web app, mobile-first, installable as a PWA, with no
  backend - all data lives in the browser's `localStorage`.
- Month tabs at the top; each month owns its own set of categories and
  amounts. Months can be added (from scratch or carried over from the
  previous month, copying categories and amounts as editable starting
  values) and deleted (behind a confirmation dialog).
- A sticky balance bar always shows income, expense, and the difference for
  the active month.
- Expense/Income categories, added manually or from a curated default list,
  sorted by amount descending (recalculated on every change). Deleting a
  category is a quick action (e.g. swipe) with an Undo toast, no modal.
- Each category holds one total amount for the month (not a transaction
  list), editable via a synced manual input + adaptive slider (starts at
  0-50,000 RUB, step 100; the max grows if the user enters or drags past it).
- Light/dark theme toggle.
- A chart visualizing the category breakdown for the active month.
- PWA installability: web manifest, icons, standalone display, and a service
  worker caching static assets for full offline use.

## Capabilities

### New Capabilities
- `month-management`: creating, switching between (tabs), carrying over, and
  deleting months; the always-visible income/expense/difference balance for
  the active month.
- `category-management`: per-month expense/income categories - adding
  (manual or default list), amount-descending sort, and swipe-to-delete with
  Undo.
- `amount-entry`: entering a category's monthly total via a manual field and
  a synced, self-adapting slider.
- `theme-switching`: toggling and persisting a light/dark UI theme.
- `category-charts`: chart visualization of the active month's category
  breakdown.
- `pwa-shell`: installable, offline-capable PWA packaging (manifest, icons,
  service worker).

### Modified Capabilities
(none - greenfield project, nothing existing to modify)

## Impact

- Affected code: entire app is new (currently only `README.md` and
  `docs/spec.md` exist). Introduces the app's source tree, build tooling,
  and a PWA manifest/service worker.
- Dependencies: a frontend framework/build stack (see `design.md` for the
  concrete choice) plus a charting library; data persistence via browser
  `localStorage`, no server or database.
- No existing systems affected - this is the first feature built in the
  repo.
