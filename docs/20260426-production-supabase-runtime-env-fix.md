# 本番で記事一覧が表示されない問題の修正

## 変更内容
- `index.html` に `window.__APP_ENV__` を追加し、Supabase設定をランタイム注入できるようにした。
- `worker.mjs` でHTMLレスポンス配信時に `__SUPABASE_URL__` / `__SUPABASE_KEY__` プレースホルダーを `env` の値へ置換する処理を追加した。
- `app/lib/supabase.server.ts` で環境変数の読み取り優先順位を「ランタイム注入値 -> `VITE_*` -> `SUPABASE_*`」へ変更した。
- `app/vite-env.d.ts` に `window.__APP_ENV__` の型定義を追加した。

## なぜ必要か
- 本番ではビルド時に `.env` が注入されない構成になりやすく、`import.meta.env` 依存だけだとSupabaseクライアントが未初期化になり、記事一覧が空になるため。

## 選択理由
- KISS: WorkerでHTMLを置換するだけで既存のフロント構成を大きく変えずに対応できる。
- YAGNI: 新しいAPIサーバーやSSR層を追加せず、現行の静的配信+Worker構成を維持できる。
- DRY: 全ページ共通で利用する `window.__APP_ENV__` を1箇所で定義し、各ページ個別の環境変数分岐を避けた。

## 具体例
- 本番Workerの `env.SUPABASE_URL` が設定済みなら、配信HTML内の `window.__APP_ENV__.SUPABASE_URL` に実値が入り、`listArticles()` からSupabase取得が成功する。
