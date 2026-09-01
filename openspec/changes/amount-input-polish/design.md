## Context

Follow-up polish on `AmountInput`/category defaults after the last UX pass
(see proposal.md - Why). No new dependencies or data model changes.

## Goals / Non-Goals

**Goals:**
- Make the default category lists cover the categories the user actually
  asked for.
- Make slider-max growth strictly one-step-per-gesture, closing the gap
  that let a single drag compound growth beyond the intended 50,000 RUB.
- Give a precise, non-drag way to nudge the amount to an exact value.

**Non-Goals:**
- Rethinking the slider itself (no value tooltip/bubble, no log-scale
  range) - the user picked stepper buttons over those alternatives.
- Any change to how growth amount/rounding is computed (`nextSliderMax` /
  the store's 50,000 rounding block) - unchanged, still correct per call.

## Decisions

### Default categories: content-only, no spec delta
`DEFAULT_EXPENSE_CATEGORIES` gains Кредиты, Аренда, Такси, Домашние
животные, Спорт; `DEFAULT_INCOME_CATEGORIES` gains Аренда. The
category-management spec deliberately doesn't enumerate default names (see
its "Add category from default list" requirement), so this is a content
change, not a behavior contract change - no delta spec needed for it.
`docs/spec.md` sections 6.1/6.2 (the original source-of-truth lists) are
updated to match, so the doc doesn't drift from what ships.

### Cascading growth: guard per drag gesture, not per store call
The store's growth math (`amount === sliderMax` -> `nextSliderMax(amount)`)
is correct for any single call - it always adds exactly one 50,000 block.
The reported "adds too much at once" is a component-level issue: a native
`<input type="range">` continues to translate pointer position into value
throughout one held-down drag, and if that recomputation lands exactly on
the newly-grown maximum again before the user releases, `AmountInput`
would call `onChange` a second time, triggering a second growth step
within what feels like one gesture.

Fix: `AmountInput` tracks the drag with `onPointerDown`/`onPointerUp` on
the range input, plus a ref that's set the first time a tick's value
equals the current `sliderMax` during that drag. While that ref is set,
further slider ticks in the same drag still call `onChange` (so the
amount keeps tracking the pointer normally) but are treated as "already
grew this gesture" - the guard doesn't block the amount from updating,
only prevents the growth condition from being re-evaluated as a *new*
edge-reached event for the remainder of that drag. The ref resets on
pointer up/cancel, so the next drag gesture can grow the range again
normally.

Alternative considered: move the guard into the store (e.g. a "growth
in flight" flag). Rejected - the store has no concept of "one drag
gesture", that's inherently a DOM/pointer-event concept that belongs in
the component.

### Stepper buttons
Two buttons (`−` / `+`) flank the manual number field, calling the same
`onChange` the field and slider already use, adjusted by the slider's step
constant (1,000). Decrement clamps at 0, matching the existing manual-entry
floor. No new store action needed - this is purely a third way to drive
the existing `onChange`.

## Risks / Trade-offs

- [Risk] The drag-guard ref could theoretically mask a legitimate second
  growth need if a user's single physical drag gesture spans an enormous
  distance crossing multiple 50,000 boundaries in one motion (rare on a
  touchscreen, but possible with a mouse) → Mitigation: accepted; the user
  can just drag again or type/step the rest of the way, and this is a
  deliberate trade-off against the reported "too much at once" complaint.

## Migration Plan

No data migration - client-side behavior/content changes deployed via the
existing GitHub Pages workflow on merge to main.
