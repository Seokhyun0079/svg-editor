import React, { useState, useCallback } from 'react'
import { Toolbar } from './components/Toolbar'
import { SvgCanvas } from './components/SvgCanvas'
import { ShapeList } from './components/ShapeList'
import { PropertyPanel } from './components/PropertyPanel'
import { buildSvgString, downloadSvg } from './utils/exportSvg'
import { parseSvgString } from './utils/importSvg'
import styles from './App.module.css'

export default function App() {
  const [elements, setElements] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [tool, setTool] = useState('select')

  const selectedElement = elements.find((el) => el.id === selectedId) ?? null

  const handleUpdateElement = useCallback((updated) => {
    setElements((prev) => prev.map((el) => (el.id === updated.id ? updated : el)))
  }, [])

  const handleDeleteElement = useCallback((id) => {
    setElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedId === id) setSelectedId(null)
  }, [selectedId])

  const handleReorder = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return
    setElements((prev) => {
      const next = [...prev]
      const [item] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, item)
      return next
    })
  }, [])

  const handleExport = useCallback(() => {
    const svgString = buildSvgString(elements)
    downloadSvg(svgString)
  }, [elements])

  const handleClear = useCallback(() => {
    setElements([])
    setSelectedId(null)
  }, [])

  const handleImport = useCallback((svgText) => {
    try {
      const next = parseSvgString(svgText)
      setElements(next)
      setSelectedId(null)
    } catch (_) {
      // parsing failed; keep current state
    }
  }, [])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <Toolbar
          tool={tool}
          onToolChange={setTool}
          onExport={handleExport}
          onImport={handleImport}
          onClear={handleClear}
        />
      </header>
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <ShapeList
            elements={elements}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDeleteElement}
            onReorder={handleReorder}
          />
        </aside>
        <main className={styles.main}>
          <SvgCanvas
            elements={elements}
            selectedId={selectedId}
            tool={tool}
            onElementsChange={setElements}
            onSelect={setSelectedId}
          />
        </main>
        <aside className={styles.sidebar}>
          <PropertyPanel element={selectedElement} onUpdate={handleUpdateElement} />
        </aside>
      </div>
    </div>
  )
}
