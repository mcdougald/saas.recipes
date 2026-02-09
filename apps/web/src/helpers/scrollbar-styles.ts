/**
 * Options for custom scrollbar styling.
 * Supports a black/white (or light/dark) theme.
 */
export type ScrollbarStyleOptions = {
  /** CSS class name applied to the scrollable element. Default: `scrollbar-thin-bw` */
  className?: string
  /** Scrollbar track (background) color. Default: theme track */
  trackColor?: string
  /** Scrollbar thumb (handle) color. Default: theme thumb */
  thumbColor?: string
  /** Thumb color on hover. Default: slightly lighter/darker than thumb */
  thumbHoverColor?: string
  /** Width of the scrollbar in px (WebKit). Default: 6 */
  width?: number
}

const DEFAULT_CLASS = "scrollbar-thin-bw"
const DEFAULT_WIDTH = 6
const DEFAULT_TRACK = "rgb(229 231 235)" /* gray-200, works on white */
const DEFAULT_THUMB = "rgb(156 163 175)" /* gray-400 */
const DEFAULT_THUMB_HOVER = "rgb(107 114 128)" /* gray-500 */

/** Dark theme defaults (for dark mode or dark sidebars) */
const DARK_TRACK = "rgb(38 38 38)"
const DARK_THUMB = "rgb(115 115 115)"
const DARK_THUMB_HOVER = "rgb(163 163 163)"

/**
 * Generates CSS for a custom thin scrollbar that works across browsers.
 * - WebKit (Chrome, Safari, Edge): full custom styling
 * - Firefox: scrollbar-width + scrollbar-color
 *
 * Use the returned `css` in a <style> tag (e.g. in layout or component)
 * and apply `className` to the scrollable element.
 */
export function getScrollbarStyles(options: ScrollbarStyleOptions = {}): {
  className: string
  css: string
} {
  const {
    className = DEFAULT_CLASS,
    trackColor = DEFAULT_TRACK,
    thumbColor = DEFAULT_THUMB,
    thumbHoverColor = DEFAULT_THUMB_HOVER,
    width = DEFAULT_WIDTH,
  } = options

  const selector = `.${className}`

  const webkitCss = `
${selector}::-webkit-scrollbar {
  width: ${width}px;
  height: ${width}px;
}
${selector}::-webkit-scrollbar-track {
  background: ${trackColor};
  border-radius: ${width}px;
}
${selector}::-webkit-scrollbar-thumb {
  background: ${thumbColor};
  border-radius: ${width}px;
}
${selector}::-webkit-scrollbar-thumb:hover {
  background: ${thumbHoverColor};
}
${selector}::-webkit-scrollbar-corner {
  background: ${trackColor};
}
`.trim()

  const firefoxCss = `
${selector} {
  scrollbar-width: thin;
  scrollbar-color: ${thumbColor} ${trackColor};
}
`.trim()

  const css = [webkitCss, firefoxCss].join("\n\n")
  return { className, css }
}

/**
 * Preset: thin black/white scrollbar for light backgrounds.
 */
export function getScrollbarThinLight(): { className: string; css: string } {
  return getScrollbarStyles({
    className: "scrollbar-thin-light",
    trackColor: "rgb(243 244 246)",
    thumbColor: "rgb(156 163 175)",
    thumbHoverColor: "rgb(107 114 128)",
    width: 6,
  })
}

/**
 * Preset: thin black/white scrollbar for dark backgrounds (e.g. dark sidebar).
 */
export function getScrollbarThinDark(): { className: string; css: string } {
  return getScrollbarStyles({
    className: "scrollbar-thin-dark",
    trackColor: DARK_TRACK,
    thumbColor: DARK_THUMB,
    thumbHoverColor: DARK_THUMB_HOVER,
    width: 6,
  })
}
