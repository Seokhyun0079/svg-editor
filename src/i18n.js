/**
 * Browser-language-based i18n. Supports ko, en, ja.
 * getLocale() from navigator.language; t(key) for translated string.
 */

const translations = {
  ko: {
    tools: { select: '선택', rect: '사각형', circle: '원', line: '선', path: '경로' },
    actions: {
      importSvg: 'SVG 불러오기',
      importSvgTitle: 'SVG 파일 열기',
      exportSvg: 'SVG 저장',
      exportSvgTitle: 'SVG 다운로드',
      clear: '지우기',
      clearTitle: '캔버스 비우기',
    },
    shapeList: {
      title: '요소',
      empty: '캔버스를 클릭하고 드래그하여 도형을 추가하세요.',
      deleteTitle: '삭제',
    },
    shapeTypes: { rect: '사각형', circle: '원', line: '선', path: '경로' },
    propertyPanel: {
      title: '속성',
      placeholder: '요소를 선택하세요.',
      fill: '채우기',
      stroke: '테두리',
      strokeWidth: '테두리 두께',
      x: 'X',
      y: 'Y',
      width: '너비',
      height: '높이',
      cx: '중심 X',
      cy: '중심 Y',
      r: '반지름',
      x1: 'X1',
      y1: 'Y1',
      x2: 'X2',
      y2: 'Y2',
      pathD: 'd (경로)',
    },
  },
  en: {
    tools: { select: 'Select', rect: 'Rectangle', circle: 'Circle', line: 'Line', path: 'Path' },
    actions: {
      importSvg: 'Load SVG',
      importSvgTitle: 'Open SVG file',
      exportSvg: 'Save SVG',
      exportSvgTitle: 'Download SVG',
      clear: 'Clear',
      clearTitle: 'Clear canvas',
    },
    shapeList: {
      title: 'Elements',
      empty: 'Click and drag on the canvas to add shapes.',
      deleteTitle: 'Delete',
    },
    shapeTypes: { rect: 'Rectangle', circle: 'Circle', line: 'Line', path: 'Path' },
    propertyPanel: {
      title: 'Properties',
      placeholder: 'Select an element.',
      fill: 'Fill',
      stroke: 'Stroke',
      strokeWidth: 'Stroke width',
      x: 'X',
      y: 'Y',
      width: 'Width',
      height: 'Height',
      cx: 'Center X',
      cy: 'Center Y',
      r: 'Radius',
      x1: 'X1',
      y1: 'Y1',
      x2: 'X2',
      y2: 'Y2',
      pathD: 'd (path)',
    },
  },
  ja: {
    tools: { select: '選択', rect: '四角', circle: '円', line: '線', path: 'パス' },
    actions: {
      importSvg: 'SVGを開く',
      importSvgTitle: 'SVGファイルを開く',
      exportSvg: 'SVG保存',
      exportSvgTitle: 'SVGをダウンロード',
      clear: '消去',
      clearTitle: 'キャンバスをクリア',
    },
    shapeList: {
      title: '要素',
      empty: 'キャンバスでドラッグして図形を追加します。',
      deleteTitle: '削除',
    },
    shapeTypes: { rect: '四角', circle: '円', line: '線', path: 'パス' },
    propertyPanel: {
      title: 'プロパティ',
      placeholder: '要素を選択してください。',
      fill: '塗り',
      stroke: '線',
      strokeWidth: '線の太さ',
      x: 'X',
      y: 'Y',
      width: '幅',
      height: '高さ',
      cx: '中心X',
      cy: '中心Y',
      r: '半径',
      x1: 'X1',
      y1: 'Y1',
      x2: 'X2',
      y2: 'Y2',
      pathD: 'd (パス)',
    },
  },
}

const supported = ['ko', 'en', 'ja']

/** Detect locale from navigator.language (e.g. ko-KR → ko). Falls back to 'en'. */
export function getLocale() {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language || navigator.userLanguage || ''
  const base = lang.slice(0, 2).toLowerCase()
  return supported.includes(base) ? base : 'en'
}

export function t(key) {
  const locale = getLocale()
  const parts = key.split('.')
  let obj = translations[locale] || translations.en
  for (const p of parts) {
    obj = obj?.[p]
    if (obj == null) {
      obj = key.split('.').reduce((o, k) => o?.[k], translations.en)
      return typeof obj === 'string' ? obj : key
    }
  }
  return typeof obj === 'string' ? obj : key
}
