import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createShape, getShapeFromDrag, moveShape, constrainLineEnd } from '../utils/shapeFactory'
import { renderShape } from '../utils/renderShape'
import styles from './SvgCanvas.module.css'

const SVG_VIEWBOX = { width: 600, height: 400 }

export function SvgCanvas({ elements, selectedId, tool, onElementsChange, onSelect }) {
  const svgRef = useRef(null)
  const [dragStart, setDragStart] = useState(null)
  const [dragCurrent, setDragCurrent] = useState(null) // { pt: {x,y}, shiftKey: boolean }
  const [moveStart, setMoveStart] = useState(null)

  const getPoint = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = SVG_VIEWBOX.width / rect.width
    const scaleY = SVG_VIEWBOX.height / rect.height
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top) * scaleY),
    }
  }, [])

  const isCanvasArea = useCallback((e) => {
    const t = e.target
    return t === svgRef.current || t?.dataset?.canvasBackground === 'true'
  }, [])

  const handleCanvasMouseDown = useCallback(
    (e) => {
      if (!isCanvasArea(e)) return
      const pt = getPoint(e)
      if (tool === 'select') {
        onSelect(null)
        return
      }
      if (['rect', 'circle', 'line', 'path'].includes(tool)) {
        setDragStart(pt)
        setDragCurrent({ pt, shiftKey: e.shiftKey })
      }
    },
    [tool, getPoint, onSelect, isCanvasArea]
  )

  const finishDrag = useCallback(
    (e) => {
      if (!dragStart) return
      let pt = getPoint(e)
      if (tool === 'line' && e.shiftKey) pt = constrainLineEnd(dragStart, pt)
      const geometry = getShapeFromDrag(dragStart, pt, tool)
      if (geometry) {
        const { type, ...attrs } = geometry
        const newShape = createShape(type, attrs)
        onElementsChange([...elements, newShape])
        onSelect(newShape.id)
      }
      setDragStart(null)
      setDragCurrent(null)
    },
    [tool, dragStart, elements, getPoint, onElementsChange, onSelect]
  )

  const handleCanvasMouseUp = useCallback(
    (e) => {
      if (!isCanvasArea(e) || !dragStart) return
      finishDrag(e)
    },
    [isCanvasArea, dragStart, finishDrag]
  )

  const handleCanvasMouseMove = useCallback(
    (e) => {
      if (!dragStart) return
      setDragCurrent({ pt: getPoint(e), shiftKey: e.shiftKey })
    },
    [dragStart, getPoint]
  )

  useEffect(() => {
    if (!dragStart) return
    const onWindowMouseMove = (e) => setDragCurrent({ pt: getPoint(e), shiftKey: e.shiftKey })
    const onWindowMouseUp = (e) => finishDrag(e)
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUp)
    }
  }, [dragStart, finishDrag, getPoint])

  const handleShapeMouseDown = useCallback(
    (e, el) => {
      e.stopPropagation()
      if (tool === 'select' && el.id === selectedId) {
        setMoveStart({ id: el.id, startPoint: getPoint(e), initialShape: el })
      }
    },
    [tool, selectedId, getPoint]
  )

  const handleShapeClick = useCallback(
    (e, id) => {
      e.stopPropagation()
      if (tool === 'select') onSelect(id)
    },
    [tool, onSelect]
  )

  const applyMove = useCallback(
    (e) => {
      if (!moveStart) return
      const pt = getPoint(e)
      const dx = pt.x - moveStart.startPoint.x
      const dy = pt.y - moveStart.startPoint.y
      const moved = moveShape(moveStart.initialShape, dx, dy)
      onElementsChange(
        elements.map((el) => (el.id === moveStart.id ? moved : el))
      )
    },
    [moveStart, elements, getPoint, onElementsChange]
  )

  useEffect(() => {
    if (!moveStart) return
    const onWindowMouseMove = (e) => applyMove(e)
    const onWindowMouseUp = () => setMoveStart(null)
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUp)
    }
  }, [moveStart, applyMove])

  return (
    <div className={styles.wrapper}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={`0 0 ${SVG_VIEWBOX.width} ${SVG_VIEWBOX.height}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseMove={handleCanvasMouseMove}
      >
        <rect width="100%" height="100%" fill="#1a1b26" data-canvas-background="true" />
        {dragStart && dragCurrent && (() => {
          const end = tool === 'line' && dragCurrent.shiftKey
            ? constrainLineEnd(dragStart, dragCurrent.pt)
            : dragCurrent.pt
          const previewShape = getShapeFromDrag(dragStart, end, tool)
          return previewShape ? (
            <g pointerEvents="none">{renderShape(previewShape, false, { preview: true })}</g>
          ) : null
        })()}
        {elements.map((el) => (
          <g
            key={el.id}
            className={selectedId === el.id ? styles.selectedShape : undefined}
            onMouseDown={(e) => handleShapeMouseDown(e, el)}
            onClick={(e) => handleShapeClick(e, el.id)}
            style={{ cursor: tool === 'select' ? 'pointer' : 'default' }}
          >
            {renderShape(el, selectedId === el.id)}
          </g>
        ))}
      </svg>
    </div>
  )
}
