/** Constrain line end to 0°, 45°, 90°, … (nearest 45°). Use when Shift is held. */
export function constrainLineEnd(start, end) {
  if (!start || !end) return end
  const dx = end.x - start.x
  const dy = end.y - start.y
  const r = Math.hypot(dx, dy)
  if (r === 0) return { ...end }
  const angle = Math.atan2(dy, dx)
  const step = Math.PI / 4
  const snapped = Math.round(angle / step) * step
  return {
    x: Math.round(start.x + r * Math.cos(snapped)),
    y: Math.round(start.y + r * Math.sin(snapped)),
  }
}

/** Build shape geometry from drag start and end point. Used for both preview and final shape. */
export function getShapeFromDrag(start, end, type) {
  if (!start || !end) return null
  switch (type) {
    case 'rect': {
      const x = Math.min(start.x, end.x)
      const y = Math.min(start.y, end.y)
      const width = Math.abs(end.x - start.x) || 60
      const height = Math.abs(end.y - start.y) || 40
      return { type: 'rect', x, y, width, height }
    }
    case 'circle': {
      const r = Math.max(20, Math.hypot(end.x - start.x, end.y - start.y))
      return { type: 'circle', cx: start.x, cy: start.y, r }
    }
    case 'line':
      return { type: 'line', x1: start.x, y1: start.y, x2: end.x, y2: end.y }
    case 'path':
      return { type: 'path', d: `M${start.x} ${start.y} L${end.x} ${end.y}` }
    default:
      return null
  }
}

/** Translate path `d` by (dx, dy). Handles absolute M/L and number pairs; works for editor-generated paths. */
export function translatePathD(d, dx, dy) {
  if (!d || (dx === 0 && dy === 0)) return d
  return d.replace(/([\d.-]+)\s+([\d.-]+)/g, (_, x, y) => `${Number(x) + dx} ${Number(y) + dy}`)
}

/** Return a copy of the shape moved by (dx, dy). Used for drag-to-move. */
export function moveShape(shape, dx, dy) {
  const out = { ...shape }
  switch (shape.type) {
    case 'rect':
      out.x = shape.x + dx
      out.y = shape.y + dy
      break
    case 'circle':
      out.cx = shape.cx + dx
      out.cy = shape.cy + dy
      break
    case 'line':
      out.x1 = shape.x1 + dx
      out.y1 = shape.y1 + dy
      out.x2 = shape.x2 + dx
      out.y2 = shape.y2 + dy
      break
    case 'path':
      out.d = translatePathD(shape.d, dx, dy)
      break
    default:
      break
  }
  return out
}

/** Create default attributes for each shape type. Reused for new shapes. */
export function createShape(type, overrides = {}) {
  const base = {
    id: crypto.randomUUID(),
    fill: '#7aa2f7',
    stroke: '#3b4261',
    strokeWidth: 2,
  };
  const byType = {
    rect: { ...base, type: 'rect', x: 50, y: 50, width: 100, height: 80 },
    circle: { ...base, type: 'circle', cx: 100, cy: 100, r: 50 },
    line: { ...base, type: 'line', x1: 50, y1: 50, x2: 150, y2: 150 },
    path: { ...base, type: 'path', d: 'M50 50 L150 50 L100 120 Z' },
  };
  const shape = byType[type] ?? byType.rect;
  return { ...shape, ...overrides, id: overrides.id ?? shape.id };
}
