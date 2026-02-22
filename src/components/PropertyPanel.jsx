import React from 'react'
import { t } from '../i18n'
import styles from './PropertyPanel.module.css'

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      {children}
    </div>
  )
}

export function PropertyPanel({ element, onUpdate }) {
  if (!element) {
    return (
      <div className={styles.panel}>
        <h3 className={styles.title}>{t('propertyPanel.title')}</h3>
        <p className={styles.placeholder}>{t('propertyPanel.placeholder')}</p>
      </div>
    )
  }

  const update = (key, value) => onUpdate({ ...element, [key]: value })

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>{t('propertyPanel.title')}</h3>
      <div className={styles.fields}>
        <Field label={t('propertyPanel.fill')}>
          <input
            type="color"
            value={element.fill ?? '#7aa2f7'}
            onChange={(e) => update('fill', e.target.value)}
          />
        </Field>
        <Field label={t('propertyPanel.stroke')}>
          <input
            type="color"
            value={element.stroke ?? '#3b4261'}
            onChange={(e) => update('stroke', e.target.value)}
          />
        </Field>
        <Field label={t('propertyPanel.strokeWidth')}>
          <input
            type="number"
            min={0}
            value={element.strokeWidth ?? 2}
            onChange={(e) => update('strokeWidth', Number(e.target.value) || 0)}
          />
        </Field>

        {element.type === 'rect' && (
          <>
            <Field label={t('propertyPanel.x')}><input type="number" value={element.x} onChange={(e) => update('x', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.y')}><input type="number" value={element.y} onChange={(e) => update('y', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.width')}><input type="number" min={1} value={element.width} onChange={(e) => update('width', Number(e.target.value) || 1)} /></Field>
            <Field label={t('propertyPanel.height')}><input type="number" min={1} value={element.height} onChange={(e) => update('height', Number(e.target.value) || 1)} /></Field>
          </>
        )}
        {element.type === 'circle' && (
          <>
            <Field label={t('propertyPanel.cx')}><input type="number" value={element.cx} onChange={(e) => update('cx', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.cy')}><input type="number" value={element.cy} onChange={(e) => update('cy', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.r')}><input type="number" min={1} value={element.r} onChange={(e) => update('r', Number(e.target.value) || 1)} /></Field>
          </>
        )}
        {element.type === 'line' && (
          <>
            <Field label={t('propertyPanel.x1')}><input type="number" value={element.x1} onChange={(e) => update('x1', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.y1')}><input type="number" value={element.y1} onChange={(e) => update('y1', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.x2')}><input type="number" value={element.x2} onChange={(e) => update('x2', Number(e.target.value))} /></Field>
            <Field label={t('propertyPanel.y2')}><input type="number" value={element.y2} onChange={(e) => update('y2', Number(e.target.value))} /></Field>
          </>
        )}
        {element.type === 'path' && (
          <Field label={t('propertyPanel.pathD')}>
            <input
              type="text"
              value={element.d}
              onChange={(e) => update('d', e.target.value)}
              placeholder="M0 0 L100 100"
            />
          </Field>
        )}
      </div>
    </div>
  )
}
