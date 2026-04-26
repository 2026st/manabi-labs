# Supabase記事一覧が空になる不具合修正

## 症状
- 「知識の箱」「みんなの記事」「検索」で結果が出ない。

## 原因
- `app/lib/supabase.server.ts` で環境変数を `const env = import.meta.env` に代入してから参照していた。
- Viteの置換は `import.meta.env.X` の直接参照に対して行われるため、代入後の `env.SUPABASE_URL` は本番ビルドで空になるケースがある。
- Supabaseクライアントが初期化されず、結果として一覧・検索が0件になった。

## 修正内容
- `supabaseUrl` / `supabaseKey` を `import.meta.env` の直接参照に変更。
- `VITE_SUPABASE_*` を優先しつつ、既存の `SUPABASE_*` も後方互換で参照。
- `app/vite-env.d.ts` に環境変数の型定義を追加。

## 具体例
- 修正前:
  - `const env = import.meta.env; const url = env.SUPABASE_URL;`
- 修正後:
  - `const url = import.meta.env.VITE_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;`

## 検証
- `pnpm run build` 成功
- 変更ファイルのlintエラーなし
