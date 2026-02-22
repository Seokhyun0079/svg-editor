const VIEWBOX = '0 0 600 400'

/** Build a full SVG document string from elements list. Single source for export format. */
export function buildSvgString(elements) {
  const parts = elements.map((el) => {
    switch (el.type) {
      case 'rect':
        return `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth ?? 2}"/>`
      case 'circle':
        return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth ?? 2}"/>`
      case 'line':
        return `<line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke}" stroke-width="${el.strokeWidth ?? 2}"/>`
      case 'path':
        return `<path d="${el.d}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth ?? 2}"/>`
      default:
        return ''
    }
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" width="600" height="400">
${parts.join('\n')}
</svg>`
}

export function downloadSvg(svgString, filename = 'drawing.svg') {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
