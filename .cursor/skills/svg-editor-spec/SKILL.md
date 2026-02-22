---
name: svg-editor-spec
description: Program specification for the SVG Editor web app. Use when implementing or changing features in the svg-editor project. Must be read before adding or modifying features, and must be updated whenever features are added or changed.
---

# SVG Editor — 프로그램 명세 (Program Specification)

## 1. 개요 / Overview

- **프로젝트**: 웹 기반 SVG 편집기. 브라우저에서 도형을 그려 `.svg` 파일로 저장할 수 있다.
- **Project**: Web-based SVG editor. Users draw shapes in the browser and export as `.svg` files.
- **기술 스택**: React 18, Vite 5. UI 라이브러리 없음. CSS 변수로 테마(Tokyo Night 스타일 다크). **다국어**: 브라우저 언어(`navigator.language`) 기반으로 한국어(ko)·영어(en)·일본어(ja) 지원. `src/i18n.js`의 `getLocale()`, `t(key)` 사용.
- **Stack**: React 18, Vite 5. No UI library. CSS variables for theming. **i18n**: Korean, English, Japanese via `navigator.language`; `getLocale()`, `t(key)` in `src/i18n.js`.

---

## 2. 데이터 모델 / Data Model

### 2.1 전역 상태 (App.jsx)

| 상태 | 타입 | 설명 |
|------|------|------|
| `elements` | `Array<Shape>` | 캔버스上的 모든 도형. 순서대로 렌더링. |
| `selectedId` | `string \| null` | 선택된 도형의 `id`. 없으면 `null`. |
| `tool` | `'select' \| 'rect' \| 'circle' \| 'line' \| 'path'` | 현재 선택된 도구. |

### 2.2 도형(Shape) 타입

모든 도형 공통: `id` (UUID), `type`, `fill`, `stroke`, `strokeWidth`.

| type | 추가 속성 |
|------|------------|
| `rect` | `x`, `y`, `width`, `height` |
| `circle` | `cx`, `cy`, `r` |
| `line` | `x1`, `y1`, `x2`, `y2` |
| `path` | `d` (SVG path `d` 문자열) |

- 도형 생성: `createShape(type, overrides)` (shapeFactory.js). `id`는 자동 생성.
- 드래그로 좌표 계산: `getShapeFromDrag(start, end, type)` (shapeFactory.js). 미리보기와 최종 도형 모두 이 함수 사용.
- 도형 이동: `moveShape(shape, dx, dy)` (shapeFactory.js). 복사본 반환. path는 `translatePathD(d, dx, dy)`로 `d` 문자열 내 좌표 평행이동.
- 선 각도 제한: `constrainLineEnd(start, end)` (shapeFactory.js). 끝점을 시작점 기준 가장 가까운 45° 방향으로 스냅. Shift+선 드래그 시 사용.

---

## 3. 기능 명세 / Feature Specification

### 3.1 도구 (Toolbar)

- **선택(select)**: 도형 클릭 시 선택. 캔버스 빈 곳 클릭 시 선택 해제. **선택된 도형을 드래그하면 이동** (rect/circle/line/path 모두 위치·경로 `d` 갱신).
- **사각형(rect)**: 캔버스에서 드래그 → 대각선 두 점으로 사각형 생성. 미리보기 표시.
- **원(circle)**: 클릭점=중심, 드래그 거리=반지름. 최소 반지름 20. 미리보기 표시.
- **선(line)**: 시작점–끝점 직선. 미리보기 표시. **Shift 누른 채 드래그** 시 끝점이 0°/45°/90°/…(45° 단위)로 제한되어 직선으로만 그려짐. `constrainLineEnd(start, end)`(shapeFactory) 사용.
- **경로(path)**: 드래그로 한 선분 생성. 속성 패널에서 `d` 수정으로 복잡한 경로 가능. 미리보기 표시.
- **SVG 불러오기**: 로컬 `.svg` 파일을 선택하면 `parseSvgString`(importSvg.js)로 파싱해 `rect`/`circle`/`line`/`path`만 추출, 에디터 도형 배열로 변환 후 캔버스에 반영. 선택은 해제. 지원하지 않는 요소(그룹·텍스트·이미지 등)는 무시.
- **SVG 저장**: 현재 `elements`를 SVG 문서 문자열로 변환 후 `drawing.svg`로 다운로드.
- **지우기**: `elements` 비우고 `selectedId` 해제.

### 3.2 캔버스 (SvgCanvas)

- **viewBox**: `0 0 600 400`. 좌표는 이 기준.
- **클릭/드래그 판별**: 배경 rect에 `data-canvas-background="true"`. 이 rect 또는 svg 자체를 클릭한 경우에만 캔버스 입력으로 처리.
- **드래그 미리보기**: 도형 도구로 드래그 중일 때 `dragStart`·`dragCurrent`(구조: `{ pt, shiftKey }`)로 실시간 미리보기. 스타일: 반투명 채우기 + 점선 테두리 (`renderShape(..., { preview: true })`). `pointerEvents="none"`. 선 도구에서 `shiftKey`이면 미리보기 끝점도 `constrainLineEnd` 적용.
- **도형 배치 후 자동 선택**: 새 도형을 그려 배치(마우스 업)한 직후, 해당 도형이 자동으로 선택됨. `finishDrag`에서 `createShape`로 생성한 `newShape.id`를 `onSelect(newShape.id)`로 전달.
- **창 밖 드래그**: `mousemove`/`mouseup`을 `window`에 등록해, 캔버스 밖에서 뗄 때도 도형 생성.
- **도형 클릭**: 선택 도구일 때만 도형 클릭으로 선택. `e.stopPropagation()`으로 캔버스 이벤트와 분리.
- **선택 표시**: 선택된 도형은 **원래 채우기/테두리 색을 유지**하고, 그 위에 같은 도형의 **선택 오버레이**만 그림(채우기 없음, `data-selection-overlay`). 오버레이에 점선 테두리와 깜빡임 애니메이션 적용. 다른 도형과 색이 겹쳐도 선택된 도형이 보이도록 함.
- **도형 이동**: 선택 도구 + 선택된 도형에서 mousedown 후 드래그 시 해당 도형을 (dx, dy)만큼 이동. `moveShape(shape, dx, dy)`(shapeFactory)로 위치 갱신. path는 `translatePathD(d, dx, dy)`로 `d` 내 좌표 평행이동. window에 mousemove/mouseup 등록해 캔버스 밖에서 뗄 때까지 이동 유지.

### 3.3 요소 목록 (ShapeList)

- 왼쪽 패널. `elements`를 목록으로 표시. 항목 클릭 → 해당 도형 선택. × 버튼 → 해당 도형 삭제.
- **순서 변경**: 목록 항목을 드래그하여 위·아래로 끌어다 놓으면 `elements` 배열 순서가 바뀜. `onReorder(fromIndex, toIndex)`로 배열 재정렬(한 요소를 제거해 새 인덱스에 삽입). 렌더 순서·내보내기 순서와 동일.

### 3.4 속성 패널 (PropertyPanel)

- 오른쪽 패널. 선택된 도형이 없으면 "요소를 선택하세요" 표시.
- 선택 시: 공통 — 채우기, 테두리, 테두리 두께. 타입별 — rect(x,y,width,height), circle(cx,cy,r), line(x1,y1,x2,y2), path(d). 변경 시 `onUpdate(updatedShape)` 호출.

### 3.5 불러오기 (importSvg.js)

- `parseSvgString(svgString)`: SVG 문자열을 DOMParser로 파싱해 `<rect>`, `<circle>`, `<line>`, `<path>`만 추출. 각 요소를 에디터 Shape 형식으로 변환(id는 새 UUID, fill/stroke/stroke-width 파싱, 없으면 기본값). 반환값은 `elements`에 그대로 사용 가능.

### 3.6 내보내기 (exportSvg.js)

- `buildSvgString(elements)`: `elements`를 SVG 문서 문자열로 변환. viewBox `0 0 600 400`, xmlns 포함.
- `downloadSvg(svgString, filename)`: Blob으로 다운로드. 기본 파일명 `drawing.svg`.

---

## 4. 파일 구조 및 역할

| 경로 | 역할 |
|------|------|
| `src/App.jsx` | 상태(elements, selectedId, tool), 핸들러(업데이트/삭제/순서 변경/불러오기/내보내기/지우기), 레이아웃. |
| `src/i18n.js` | 브라우저 언어 감지(`getLocale`), 번역 키 조회(`t(key)`). ko/en/ja 번역 객체. |
| `src/components/Toolbar.jsx` | 도구 버튼, SVG 불러오기(파일 선택), SVG 저장, 지우기. UI 문자열은 `t()` 사용. |
| `src/components/SvgCanvas.jsx` | SVG 캔버스, 드래그/미리보기/선택 이벤트. |
| `src/components/ShapeList.jsx` | 요소 목록, 선택/삭제, 드래그로 순서 변경(HTML5 DnD). UI 문자열은 `t()` 사용. |
| `src/components/PropertyPanel.jsx` | 선택 도형 속성 편집 폼. UI 문자열은 `t()` 사용. |
| `src/utils/shapeFactory.js` | `getShapeFromDrag`, `createShape`, `moveShape`, `translatePathD`, `constrainLineEnd`. |
| `src/utils/renderShape.jsx` | 도형 → SVG 요소 렌더. `options.preview` 시 미리보기 스타일. |
| `src/utils/importSvg.js` | `parseSvgString` (SVG 문자열 → 도형 배열). |
| `src/utils/exportSvg.js` | `buildSvgString`, `downloadSvg`. |

- 도형 렌더링은 `renderShape` 한 곳에서. export 시 마크업 생성은 `buildSvgString` 한 곳에서. 도형 좌표/기하 계산은 `getShapeFromDrag`·`createShape` 재사용.

---

## 5. 명세 갱신 규칙 (Spec Update Rule)

- **기능 추가**: 이 명세의 해당 섹션(기능 명세, 데이터 모델, 파일 구조)에 새 동작·상태·파일을 반드시 반영한다.
- **기능 수정**: 변경된 동작·API·제약을 이 명세에 맞게 수정한다.
- **구현 시**: 새 기능/수정 구현 전에 이 명세를 읽고, 구현 후 명세와 실제 코드가 일치하는지 확인한 뒤 필요 시 명세를 갱신한다.
