import React, { useRef } from 'react'
import { t } from '../i18n'
import styles from './Toolbar.module.css'

const TOOL_IDS = ['select', 'rect', 'circle', 'line', 'path']

export function Toolbar({ tool, onToolChange, onExport, onImport, onClear }) {
  const fileInputRef = useRef(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !onImport) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') onImport(text)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className={styles.toolbar}>
      <div className={styles.tools}>
        {TOOL_IDS.map((id) => (
          <button
            key={id}
            type="button"
            title={t(`tools.${id}`)}
            className={tool === id ? styles.active : ''}
            onClick={() => onToolChange(id)}
          >
            {t(`tools.${id}`)}
          </button>
        ))}
      </div>
      <div className={styles.actions}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".svg,image/svg+xml"
          onChange={handleFileChange}
          className={styles.fileInput}
          aria-hidden
        />
        <button type="button" onClick={handleImportClick} title={t('actions.importSvgTitle')}>
          {t('actions.importSvg')}
        </button>
        <button type="button" onClick={onExport} title={t('actions.exportSvgTitle')}>
          {t('actions.exportSvg')}
        </button>
        <button type="button" onClick={onClear} title={t('actions.clearTitle')} className={styles.danger}>
          {t('actions.clear')}
        </button>
      </div>
    </div>
  )
}
