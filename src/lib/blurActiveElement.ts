/**
 * iOS Safari consumes the first tap after a focused field to dismiss the
 * keyboard/blur it, instead of delivering it as a click to the tapped
 * target. Blurring proactively on pointerdown moves focus away within the
 * same gesture, so the subsequent click still reaches the target.
 */
export function blurActiveElement(event: React.PointerEvent<HTMLElement>) {
  const active = document.activeElement
  if (active instanceof HTMLElement && active !== event.currentTarget) {
    active.blur()
  }
}
