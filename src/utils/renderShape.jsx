import React from 'react'

const PREVIEW_STYLE = {
  fill: 'rgba(122, 162, 247, 0.2)',
  stroke: '#7aa2f7',
  strokeWidth: 2,
  strokeDasharray: '6 4',
}

/** Renders a single shape element. Single place for SVG element creation. When selected, shape keeps its colors; selection is shown by an overlay (no color change). */
export function renderShape(shape, selected, options = {}) {
  const isPreview = options.preview === true
  const common = isPreview
    ? PREVIEW_STYLE
    : {
        fill: shape.fill,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
      }

  const overlayProps = { fill: 'none', dataSelectionOverlay: true }

  const renderOne = (extra = {}) => {
    switch (shape.type) {
      case 'rect':
        return (
          <rect
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            {...common}
            {...extra}
          />
        )
      case 'circle':
        return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...common} {...extra} />
      case 'line':
        return (
          <line
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            {...common}
            {...extra}
          />
        )
      case 'path':
        return <path d={shape.d} {...common} {...extra} fill={common.fill} />
      default:
        return null
    }
  }

  if (!isPreview && selected) {
    return (
      <>
        {renderOne()}
        {renderOne(overlayProps)}
      </>
    )
  }
  return renderOne()
}
