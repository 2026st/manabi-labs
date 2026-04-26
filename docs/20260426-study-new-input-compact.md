# study 追加ページ input 微調整

## 変更内容

- `app/routes/study.new.tsx` の2つの入力欄に `input--compact` を追加
- `app/styles/global.css` に `.input--compact` を追加
  - `font-size: 16px`
  - `padding: 7px 10px`

## 実装意図

- 「勉強サイトを追加」ページの入力欄だけを一段小さくし、他ページへの影響を避ける
- 既存の `.input` は共通スタイルとして維持し、必要ページだけ上書き（KISS / DRY）

## 具体例

- 変更前: `study.new` の入力欄は共通 `.input`（`18px`）で表示
- 変更後: `study.new` のみ `input input--compact`（`16px`）になり、見た目が一回り小さくなる
