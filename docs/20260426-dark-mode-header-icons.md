## 変更内容
- ダークモード用トークンを `app/styles/tokens.css` に追加し、`theme-dark` クラスで切り替え可能にした。
- ダーク配色を指定値へ反映した。
  - `bg-page: #121414`
  - `primary: #5FD1B5`
  - `text-main: #E6F1EF`
  - `text-sub: #A7B5B2`
  - `shadow: rgba(255, 255, 255, 0.25)`
  - `secondary: #7DE2C4`
- `--color-primary-deep` はダーク時に `#49B79D` を設定した（`primary` より一段深いトーン）。
- `app/main.tsx` に初期テーマ適用処理を追加し、OSテーマを初期値にした。
- `app/components/Header.tsx` にテーマ切替ボタンを追加し、ヘッダー右側を `[テーマカラー変更] [検索] [新規作成]` の順に再構成した。
- テーマアイコンは MUI の `PaletteOutlined` を使用した。

## 実装詳細
- 初期表示時は `localStorage` の `manabi-theme` を優先し、未設定時は `prefers-color-scheme: dark` を参照する。
- ヘッダーのテーマボタン押下で `theme-dark` クラスを `document.documentElement` にトグルし、設定を `localStorage` に保存する。
- `app/styles/global.css` の `.icon-btn` をボタン要素でも使えるように更新し、MUI SVG用の `.icon-btn__svg` を追加した。

## 確認結果
- `pnpm typecheck` 成功
- 対象ファイルの Lint エラーなし

## 追加対応（ボタンのダークモード追従）
- `app/styles/global.css` の固定色をトークン参照へ変更した。
  - `.btn--primary` の文字色: `#fefefe` -> `var(--color-bg-page)`
  - `.btn--ghost` の背景色: `#fefefe` -> `var(--color-bg-page)`
- これにより、保存/キャンセル/編集など `btn` 系スタイルの色がダークモード時にも追従する。
