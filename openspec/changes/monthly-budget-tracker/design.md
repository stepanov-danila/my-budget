## Context

Greenfield repo (see proposal.md - Why): no existing app, framework, or data
model to integrate with. Constraints carried over from `docs/spec.md`: single
user, no backend, mobile-first, offline-capable, RUB-only, installable PWA.

## Goals / Non-Goals

**Goals:**
- Pick a small, cohesive client-side stack that supports the six capabilities
  (month-management, category-management, amount-entry, theme-switching,
  category-charts, pwa-shell) without a server.
- Define the local data model and persistence strategy shared by all of them.
- Define the adaptive-slider and undo-delete mechanics precisely enough that
  `tasks.md` can be broken into concrete steps.

**Non-Goals:**
- Cross-device sync, accounts, or a backend of any kind (see proposal.md).
- Data export/import or backup tooling - not requested; can be a later change.
- Offline conflict resolution - there is only ever one writer (the device
  itself), so none exists.

## Decisions

### Frontend stack: React + TypeScript + Vite + Tailwind CSS
Vite gives fast local iteration and has a mature PWA plugin
(`vite-plugin-pwa`, Workbox-based) that generates the manifest and service
worker from config instead of hand-rolled boilerplate. React + TypeScript
keeps the six capabilities as typed, composable components/hooks. Tailwind's
`dark` class strategy maps directly onto the theme-switching requirement.
Alternative considered: a meta-framework (Next.js/Remix) - rejected, there is
no server-rendered content or routing complexity to justify it for a
single-screen local-data app.

### State + persistence: a single store, `localStorage`-backed
One client-side store (e.g. Zustand with its `persist` middleware, or an
equivalent small reducer + a `localStorage` sync effect) holds the entire
app state, keyed under a versioned key such as `my-budget:v1`. Versioning the
key lets a future schema change ship a migration or a clean reset instead of
crashing on old data. Data shape:

```
{
  theme: "light" | "dark",
  activeMonthId: string,
  months: [
    {
      id: string,            // e.g. "2026-08"
      label: string,         // display label, e.g. "Август 2026"
      categories: [
        {
          id: string,
          type: "expense" | "income",
          name: string,
          amount: number,      // month total for this category, RUB
          sliderMax: number    // current adaptive slider ceiling, see below
        }
      ]
    }
  ]
}
```
Categories are per-month (per category-management's spec), so "carry over
from previous month" (month-management) is a deep copy of the previous
month's `categories` array with fresh ids.

Default category names (Expenses and Income lists from `docs/spec.md`) live
as a static constants module, not in the persisted store - they are only a
source list for the "add from defaults" dropdown, filtered against the
active month's existing category names.

### Adaptive slider maximum
Each category stores its own `sliderMax` (not a single global value), since
different categories can grow independently. Default `sliderMax` is 50,000
with a step of 100. When the entered/dragged value would meet or exceed the
current `sliderMax`, the new `sliderMax` is recalculated as the next
multiple of 50,000 strictly above the value (`ceil((value + 1) / 50000) *
50000`), so the slider always leaves headroom above the current amount
instead of sitting exactly at the new edge.

### Delete-with-Undo for categories
Deleting a category removes it from the store (and persisted `localStorage`)
immediately, while the component keeps the removed category object plus a
timer in local (non-persisted) state for the Undo toast's duration. Tapping
Undo re-inserts the kept object back into the store; letting the timer
expire simply discards it. Alternative considered: keep a "soft-deleted"
flag in the persisted store instead - rejected as unnecessary complexity for
a short-lived, non-critical action, and it would leak into every place that
reads categories (sorting, charts, balance) needing to filter it out.

### Month deletion via confirmation dialog, no Undo
Deleting a whole month is a modal, blocking confirmation (bigger blast
radius than one category), and is not undoable - consistent with
proposal.md and month-management's spec.

### Charting library: Recharts
A small, React-idiomatic charting library composed as JSX, good fit for the
one chart type this change needs (category breakdown, e.g. a donut/bar).
Alternative considered: Chart.js via a React wrapper - rejected, its
imperative canvas API is more machinery than a single chart needs.

## Risks / Trade-offs

- [Risk] `localStorage` is synchronous and size-limited (~5-10 MB depending
  on browser) → Mitigation: this app's data (short strings and numbers) is
  orders of magnitude smaller; revisit with IndexedDB only if that changes.
- [Risk] Single device, no backup: uninstalling the app or clearing site
  data loses all budget history → Mitigation: accepted per proposal.md's
  scope (explicitly no sync/backend); export/import can be proposed later.
- [Risk] Stale service worker serving an old app shell after a deploy →
  Mitigation: configure `vite-plugin-pwa` with `registerType: "autoUpdate"`
  so a new build is picked up and activated automatically on next load.
- [Risk] The Undo window is lost if the tab/app is closed before it expires
  → Mitigation: accepted; category deletion is low-stakes and trivially
  re-added, not worth persisting a pending-delete state for.

## Migration Plan

First release into an empty repo - no existing users or data to migrate.
The versioned `localStorage` key (`my-budget:v1`) is the only future-proofing
needed: a later breaking data-model change ships as `v2` with a small
one-time migration reading `v1` if present, rather than crashing on old
data.
