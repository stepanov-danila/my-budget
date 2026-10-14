import type { CSSProperties } from 'react'

// jsdom's CSS parser doesn't recognize env(), so tests check this constant
// directly rather than the rendered computed style; real browsers apply it.
export const SAFE_AREA_HEADER_STYLE: CSSProperties = {
  height: 'auto',
  lineHeight: 'normal',
  padding: '12px 16px',
  paddingTop: 'env(safe-area-inset-top)',
}
