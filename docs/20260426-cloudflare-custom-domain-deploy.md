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
