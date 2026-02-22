import React, { useCallback } from 'react'
import { t } from '../i18n'
import styles from './ShapeList.module.css'

export function ShapeList({ elements, selectedId, onSelect, onDelete, onReorder }) {
  const typeLabel = (type) => t(`shapeTypes.${type}`)
  const handleDragStart = useCallback(
    (e, index) => {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(index))
      e.dataTransfer.setData('application/json', JSON.stringify({ index }))
    },
    []
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e, toIndex) => {
      e.preventDefault()
      const raw = e.dataTransfer.getData('text/plain')
      const fromIndex = raw === '' ? -1 : parseInt(raw, 10)
      if (fromIndex < 0 || fromIndex >= elements.length) return
      if (onReorder) onReorder(fromIndex, toIndex)
    },
    [elements.length, onReorder]
  )

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{t('shapeList.title')}</h3>
      <ul className={styles.list}>
        {elements.map((el, i) => (
          <li
            key={el.id}
            className={styles.item}
            draggable
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            data-index={i}
          >
            <button
              type="button"
              className={selectedId === el.id ? styles.active : ''}
              onClick={() => onSelect(el.id)}
            >
              {typeLabel(el.type) ?? el.type} {i + 1}
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(el.id)
              }}
              title={t('shapeList.deleteTitle')}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      {elements.length === 0 && (
        <p className={styles.empty}>{t('shapeList.empty')}</p>
      )}
    </div>
  )
}
