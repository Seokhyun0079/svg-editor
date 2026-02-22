# SVG Editor

React로 만든 웹 기반 SVG 편집기입니다.  
A web-based SVG editor built with React.  
Reactで作ったWebベースのSVGエディタです。

---

## 실행 방법 / How to run / 実行方法

```bash
npm install
npm run dev
```

- 브라우저에서 `http://localhost:5173` 으로 접속하세요.  
- Open `http://localhost:5173` in your browser.  
- ブラウザで `http://localhost:5173` にアクセスしてください。

---

## 사용법 / How to use / 使い方

### 1. 도형 추가하기 / Adding shapes / 図形の追加

1. **툴바**에서 도구를 고릅니다: **사각형**, **원**, **선**, **경로** 중 하나를 클릭합니다.  
   In the **toolbar**, choose a tool: click **Rectangle**, **Circle**, **Line**, or **Path**.  
   **ツールバー**でツールを選びます：**四角**・**円**・**線**・**パス**のいずれかをクリックします。

2. **캔버스**(가운데 검은 영역)에서 **클릭한 뒤 드래그**하면 도형이 생깁니다.  
   On the **canvas** (the dark area in the center), **click and drag** to create the shape.  
   **キャンバス**（中央の暗い領域）で**クリックしてドラッグ**すると図形ができます。
   - **사각형**: 드래그한 범위가 사각형이 됩니다. / **Rectangle**: The dragged area becomes the rectangle. / **四角**: ドラッグした範囲が四角形になります。
   - **원**: 클릭한 점이 중심, 드래그한 거리가 반지름입니다. / **Circle**: Click point = center, drag distance = radius. / **円**: クリックした点が中心、ドラッグした距離が半径です。
   - **선**: 시작점에서 끝점까지 직선. / **Line**: Straight line from start to end. / **線**: 始点から終点まで直線。
   - **경로**: 드래그로 한 선분. 속성에서 `d` 수정으로 복잡한 경로 가능. / **Path**: One segment by drag; edit `d` for complex paths. / **パス**: ドラッグで1本の線分。属性の`d`を編集で複雑なパスが可能。

### 2. 도형 선택·편집 / Selecting and editing / 選択・編集

1. 툴바에서 **선택**을 누른 뒤, 캔버스에서 편집할 도형을 클릭합니다.  
   Click **Select** in the toolbar, then click a shape on the canvas to edit.  
   ツールバーで**選択**を押し、キャンバスで編集する図形をクリックします。

2. **왼쪽 패널**에서 항목을 클릭해 선택하거나 **×** 로 삭제할 수 있습니다.  
   The **left panel** lists elements; click to select or **×** to delete.  
   **左パネル**で項目をクリックして選択、**×**で削除できます。

3. **오른쪽 패널**에서 선택한 도형의 **속성**(채우기, 테두리, 위치·크기 등)을 바꿀 수 있습니다.  
   In the **right panel**, change **properties** (fill, stroke, position, size, etc.) of the selected shape.  
   **右パネル**で選択した図形の**属性**（塗り、線、位置・サイズなど）を変更できます。

### 3. SVG 저장·불러오기 / Save & load SVG / SVGの保存・読み込み

- **SVG 저장**: 툴바의 **SVG 저장** 버튼으로 현재 그림을 `drawing.svg`로 다운로드합니다.  
  **Save SVG**: Click **Save SVG** in the toolbar to download the current drawing as `drawing.svg`.  
  **SVG保存**: ツールバーの**SVG保存**ボタンで現在の絵を`drawing.svg`としてダウンロードします。
- **SVG 불러오기**: **SVG 불러오기** 버튼으로 로컬 `.svg` 파일을 열어 캔버스에 불러올 수 있습니다.  
  **Load SVG**: Use **Load SVG** to open a local `.svg` file and load it onto the canvas.  
  **SVGを開く**: **SVGを開く**ボタンでローカルの`.svg`ファイルを開き、キャンバスに読み込めます。

### 4. 캔버스 비우기 / Clear canvas / キャンバスを消去

- **지우기** 버튼으로 캔버스의 모든 도형을 삭제합니다.  
  Click **Clear** to remove all shapes from the canvas.  
  **消去**ボタンでキャンバス上のすべての図形を削除します。

---

**요약 (KO)**: 도구 선택 → 캔버스에 드래그로 도형 추가 → 선택 후 오른쪽 패널에서 속성 수정 → SVG 저장/불러오기.  
**Summary (EN)**: Choose a tool → drag on the canvas to add shapes → select and edit in the right panel → save/load SVG.  
**要約 (JA)**: ツール選択 → キャンバスでドラッグして図形追加 → 選択して右パネルで属性編集 → SVG保存・読み込み。

---

## 기능 / Features / 機能

| 한국어 | English | 日本語 |
|--------|---------|--------|
| 도형 추가 (사각형·원·선·경로) | Add shapes (rect, circle, line, path) | 図形追加（四角・円・線・パス） |
| 선택·드래그로 이동 | Select and drag to move | 選択してドラッグで移動 |
| 요소 목록에서 순서 변경 | Reorder elements in the list | 要素リストで並び替え |
| SVG 불러오기·저장 | Load and save SVG | SVGの読み込み・保存 |
| 다국어 (한/영/일, 브라우저 언어) | i18n (KO/EN/JA by browser) | 多言語（韓・英・日、ブラウザ言語） |

---

## 기술 스택 / Tech stack / 技術スタック

- React 18, Vite 5  
- UI 라이브러리 없음, CSS 변수 테마 (Tokyo Night 스타일 다크)  
- No UI library; CSS variables (Tokyo Night–style dark theme)  
- 追加UIライブラリなし、CSS変数でテーマ（Tokyo Night風ダーク）

---

## GitHub에 올리기 / Pushing to GitHub / GitHubへのアップロード

- `node_modules/`, `dist/` 등은 `.gitignore`에 포함되어 커밋되지 않습니다.  
  `node_modules/` and `dist/` are in `.gitignore` and will not be committed.  
  `node_modules/` と `dist/` は `.gitignore` に含まれるためコミットされません。

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git push -u origin main
```

- **GitHub Pages** 배포: `npm run build` 후 **dist** 폴더를 배포하세요. (dist는 .gitignore에 있으므로, 빌드 결과를 커밋할 브랜치를 쓰거나 GitHub Actions를 사용하세요.) 저장소 **Settings → Pages**에서 소스를 설정하고, `vite.config.js`의 `base`가 `'/svg-editor/'`이므로 저장소 이름을 `svg-editor`로 두면 `https://<사용자명>.github.io/svg-editor/` 에서 접속할 수 있습니다.  
- **GitHub Pages** deployment: Run `npm run build` and deploy the **dist** folder (e.g. branch that commits dist or GitHub Actions). In **Settings → Pages** set the source; with repo name `svg-editor` the site will be at `https://<username>.github.io/svg-editor/`.  
- **GitHub Pages** での公開: `npm run build` のあと **dist** フォルダをデプロイしてください。（dist は .gitignore に入っているため、ビルド結果をコミットするブランチを使うか GitHub Actions を利用してください。）リポジトリの **Settings → Pages** でソースを設定し、`vite.config.js` の `base` が `'/svg-editor/'` のため、リポジトリ名を `svg-editor` にすると `https://<ユーザー名>.github.io/svg-editor/` でアクセスできます。
