const DEFAULT_FILL = '#7aa2f7'
const DEFAULT_STROKE = '#3b4261'
const DEFAULT_STROKE_WIDTH = 2

function num(v) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : 0
}

function attr(el, name, fallback = '') {
  const v = el.getAttribute(name)
  return v != null && v !== '' ? v : fallback
}

/** Parse SVG string and return editor shape array (rect, circle, line, path only). */
export function parseSvgString(svgString) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgString, 'image/svg+xml')
  const svg = doc.querySelector('svg')
  if (!svg) return []

  const elements = []

  const push = (shape) => {
    if (shape) elements.push({ ...shape, id: crypto.randomUUID() })
  }

  svg.querySelectorAll('rect').forEach((el) => {
    push({
      type: 'rect',
      x: num(attr(el, 'x')),
      y: num(attr(el, 'y')),
      width: num(attr(el, 'width')) || 1,
      height: num(attr(el, 'height')) || 1,
      fill: attr(el, 'fill', DEFAULT_FILL) === 'none' ? 'transparent' : attr(el, 'fill', DEFAULT_FILL),
      stroke: attr(el, 'stroke', DEFAULT_STROKE) === 'none' ? 'transparent' : attr(el, 'stroke', DEFAULT_STROKE),
      strokeWidth: num(attr(el, 'stroke-width')) || DEFAULT_STROKE_WIDTH,
    })
  })

  svg.querySelectorAll('circle').forEach((el) => {
    push({
      type: 'circle',
      cx: num(attr(el, 'cx')),
      cy: num(attr(el, 'cy')),
      r: num(attr(el, 'r')) || 1,
      fill: attr(el, 'fill', DEFAULT_FILL) === 'none' ? 'transparent' : attr(el, 'fill', DEFAULT_FILL),
      stroke: attr(el, 'stroke', DEFAULT_STROKE) === 'none' ? 'transparent' : attr(el, 'stroke', DEFAULT_STROKE),
      strokeWidth: num(attr(el, 'stroke-width')) || DEFAULT_STROKE_WIDTH,
    })
  })

  svg.querySelectorAll('line').forEach((el) => {
    push({
      type: 'line',
      x1: num(attr(el, 'x1')),
      y1: num(attr(el, 'y1')),
      x2: num(attr(el, 'x2')),
      y2: num(attr(el, 'y2')),
      fill: DEFAULT_FILL,
      stroke: attr(el, 'stroke', DEFAULT_STROKE) === 'none' ? 'transparent' : attr(el, 'stroke', DEFAULT_STROKE),
      strokeWidth: num(attr(el, 'stroke-width')) || DEFAULT_STROKE_WIDTH,
    })
  })

  svg.querySelectorAll('path').forEach((el) => {
    const d = attr(el, 'd')
    if (!d) return
    push({
      type: 'path',
      d,
      fill: attr(el, 'fill', DEFAULT_FILL) === 'none' ? 'transparent' : attr(el, 'fill', DEFAULT_FILL),
      stroke: attr(el, 'stroke', DEFAULT_STROKE) === 'none' ? 'transparent' : attr(el, 'stroke', DEFAULT_STROKE),
      strokeWidth: num(attr(el, 'stroke-width')) || DEFAULT_STROKE_WIDTH,
    })
  })

  return elements
}
