# Cloudflare Workers Custom Domain Deploy

## 変更内容
- `wrangler.toml` に `workers_dev = false` を追加。
- `[[routes]]` を追加し、`manabi-labs.com/*` を Worker に紐付け。

## 実装意図
- `workers.dev` サブドメイン未登録環境でも、Custom Domain 経由でデプロイ可能にするため。
- ルーティング先を明示し、デプロイ先の曖昧さをなくすため。

## 選択理由
- すでに `manabi-labs.com` を Custom Domain として設定済みのため、最小変更で有効化できる。
- `routes` を `wrangler.toml` に持たせることで、ローカル/CI の再現性を担保できる。

## 補足
- 必要な権限は少なくとも `Workers Scripts: Edit`。route 管理を伴うため `Workers Routes: Edit` も必要。

## 方針変更（B案）
- `wrangler.toml` から `[[routes]]` を削除し、route 管理をCloudflareダッシュボード側に委譲。
- `workers_dev = false` は維持し、`workers.dev` への公開を無効化。
- これにより、WranglerはWorker本体の更新のみに集中し、Zone Route APIの権限依存を回避する。
