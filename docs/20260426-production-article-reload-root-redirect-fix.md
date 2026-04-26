# 本番 article リロードで `/` へ遷移する問題の修正

## 変更内容

- `worker.mjs` の SPA フォールバック判定を変更。
- `wrangler.toml` に `[[routes]]` (`manabi-labs.com/*`) を明示追加。

## 原因（コード観点）

- 旧実装は `env.ASSETS.fetch(request)` を先に実行し、`404` 以外をそのまま返していた。
- 配信環境によっては `/article/:id` のような非ファイルパスに対して `ASSETS` が `307 -> /` を返すことがあり、そのレスポンスをWorkerが素通ししていた。
- その結果、ページリロード時に `/` へ遷移した。

## 実装方針

- `GET + Accept: text/html + 非ファイルパス + "/" 以外` は **先に `index.html` を返す**。
- これにより `ASSETS` 側の 30x が混入しても SPA ルートは常にクライアントルーターで復元される。
- route定義を `wrangler.toml` に固定し、ダッシュボード側設定との乖離リスクを下げた。

## 具体例

- `GET /article/9d2964b3-a700-40fc-8d42-1d18dde22586`（text/html）
  - 変更前: `ASSETS` の `307 /` を返す場合がある
  - 変更後: `index.html` を返して `/article/:id` をSPAで描画

## 追加修正（再調査）

- 一部配信環境で `ASSETS.fetch("/index.html")` 自体が `307 -> /` を返し、Workerがそれをそのまま返していた。
- フォールバック取得先を `/index.html` から `/` に変更して、`307` 連鎖を遮断した。
