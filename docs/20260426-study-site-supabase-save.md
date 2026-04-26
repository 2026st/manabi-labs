# 勉強サイトリンクの Supabase 永続化

## 変更内容
- `study.new` での保存処理を `localStorage` から `Supabase` 保存に変更。
- `study` 一覧の取得元を `Supabase` に変更。
- 既存記事データと混ざらないよう、`corpus_documents.source_name` に `study-link/` プレフィックスを採用。

## 実装方針
- 既存の Supabase 接続 (`app/lib/supabase.server.ts`) を再利用し、KISS を優先。
- 追加テーブルは作らず、既存 `corpus_documents` を利用して最小変更で実現。
- 保存データは `content` に JSON 文字列で格納。
  - 例: `{"label":"公式ドキュメント","url":"https://example.com"}`

## 追加した関数
- `listStudySites(): Promise<StudySite[]>`
  - `source_name LIKE 'study-link/%'` でリンクのみ取得。
- `createStudySite({ label, url }): Promise<boolean>`
  - ラベル/URL をバリデーションし、URLは `https://` を自動補完。
  - `source_name: study-link/<uuid>.json` で保存。

## 画面側の反映
- `app/routes/study.new.tsx`
  - `createStudySite` を呼び出す非同期保存に変更。
- `app/routes/study.tsx`
  - `listStudySites` を非同期で取得して表示。
  - 初期表示の既定リンク（過去問道場）は従来どおり表示。

## 補足
- Supabase 未設定時は保存失敗になり、画面でエラー表示。
- 旧 `localStorage` のデータは自動移行しない（必要なら別途移行処理を追加）。
