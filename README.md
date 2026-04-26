# まなびラボ

学習メモ・記事・勉強サイトリンクを一元管理する Web アプリです。  
フロントエンドは React + Vite、データ保存は Supabase、配信は Cloudflare Workers を使います。

## 主な機能

- 知識メモ一覧（`/`）
- 記事一覧（`/articles`）
- 勉強サイト一覧（`/study`）
- 記事検索（`/search`）
- 記事作成（`/new`）
- 記事詳細・編集（`/article/:id`, `/article/:id/edit`）
- 勉強サイト追加（`/study/new`）

## 技術スタック

- React 19
- React Router DOM 7
- TypeScript
- Vite 8
- MUI + Emotion
- Supabase JavaScript SDK
- Cloudflare Workers + Wrangler

## ディレクトリ構成

```txt
app/
  components/    共通 UI
  lib/           Supabase アクセス・データ変換
  routes/        画面ルーティング
  styles/        デザイントークン・グローバル CSS
docs/            変更履歴・運用メモ
public/          静的アセット
worker.mjs       Cloudflare Worker（SPAフォールバック + env注入）
wrangler.toml    Cloudflare デプロイ設定
```

## セットアップ

### 1. 依存関係をインストール

```bash
pnpm install
```

### 2. 環境変数を設定

`.env.example` をコピーして `.env` を作成してください。

```bash
cp .env.example .env
```

最低限、次を設定します。

```env
SUPABASE_URL=
SUPABASE_KEY=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
```

### 3. 開発サーバー起動

```bash
pnpm run dev
```

## npm scripts

- `pnpm run dev`: 開発サーバー起動
- `pnpm run build`: 本番ビルド
- `pnpm run preview`: ビルド結果のローカル確認
- `pnpm run typecheck`: 型チェック
- `pnpm run lint`: 型チェック（ESLint ではない）
- `pnpm run deploy`: `build` 後に Cloudflare へデプロイ

## Supabase 側の前提

このアプリは `corpus_documents` テーブルを利用します。最低限、次の列が必要です。

- `id`
- `source_name`
- `content`
- `created_at`
- `updated_at`

`source_name` の命名規約でカテゴリを判定しています。

- `articles/...` -> 記事
- `study-link/...` または `study/...` -> 勉強サイト
- それ以外 -> 知識メモ

## 環境変数の読み取り優先順位

Supabase 設定は次の順で解決されます。

1. `window.__APP_ENV__`（Cloudflare Worker が HTML に注入）
2. `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY`
3. `SUPABASE_URL` / `SUPABASE_KEY`

本番運用では `worker.mjs` が HTML の `__SUPABASE_URL__` / `__SUPABASE_KEY__` を置換するため、`wrangler.toml` の `run_worker_first = true` が重要です。

## デプロイ

```bash
pnpm run deploy
```

`wrangler.toml` は `manabi-labs.com` 向けルート設定を前提にしています。  
別ドメインで使う場合は `routes` / `zone_name` を変更してください。

## よくあるハマりどころ

- Supabase 未設定時は一覧が空、作成/更新は失敗します。
- `pnpm` 前提です（`npm` では lockfile とずれる可能性があります）。
- SPA ルートでリロードして白画面になる場合、Worker 設定とルート設定を確認してください。

## ライセンス

Private repository.
