# manabi-labs-design 実装内容

## 変更概要
- `Vite + React + React Router + Cloudflare Workers` の最小構成を新規作成。
- Figma `manabi-labs` のSPデザイン（390px中心）に合わせて、一覧/詳細/編集/作成/検索を実装。
- Supabase の `corpus_documents` をそのまま利用して、記事の一覧表示・詳細表示・作成・更新・検索を実装。

## 実装した画面
- `/` 知識の箱
- `/articles` みんなの記事
- `/study` 勉強サイト
- `/article/:id` 記事詳細
- `/article/:id/edit` 記事編集
- `/new` 記事作成
- `/search` 検索

## データマッピング方針
- `corpus_documents.id` を記事IDとして利用。
- `source_name` の接頭辞でカテゴリを判定:
  - `knowledge/` → 知識の箱
  - `articles/` → みんなの記事
  - `study/` → 勉強サイト
- タイトルは `content` の先頭有効行（`#` 見出し記法は除去）から抽出。

## 環境変数
- `.env.example` を以下に更新:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_KEY`

## セキュリティ・運用
- APIキーのハードコードは未実施。
- 環境変数未設定時は Supabase 呼び出しを行わず、空一覧として安全に動作。
- 入力値は `maxLength` と空チェックで最低限のバリデーションを実装。

## 検証結果
- `pnpm run typecheck` : 成功
- `pnpm run lint` : 成功
- `pnpm run build` : 成功

## 今後の改善候補
- Figmaアセットの絵文字代替部分をSVG/画像で完全一致に近づける。
- `corpus_chunks` の更新処理（埋め込み再計算）を別ジョブに切り出す。
- Cloudflare WorkersのSecrets運用（`wrangler secret put`）をCI化する。
