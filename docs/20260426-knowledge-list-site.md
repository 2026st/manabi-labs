# ナレッジ一覧サイト実装メモ

## 変更内容
- ナレッジ一覧の取得処理を `app/lib/knowledge.repository.ts` に分離し、一覧ロジックの責務を明確化。
- `app/routes/home.tsx` に `loading / error / 未設定` 表示を追加。
- デザイン値を `app/styles/tokens.css` に集約し、`app/styles/global.css` はトークン参照へ統一。
- `app/main.tsx` で `tokens.css` を先に読み込み、全画面で同一トークンを使用。

## 実装意図
- Figma値の追従先を1箇所に集約し、色やフォント変更時の修正コストを最小化。
- Supabase未設定時に空データと見分けがつかない問題を回避し、原因をUI上で明示。
- KISS/YAGNIを守り、既存ルーティングや機能は維持したままナレッジ一覧の品質を優先。

## Supabase設定
- `.env.example` のキーを `.env` に設定:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_KEY`

## Cloudflare Workers公開手順
1. `pnpm install`
2. `pnpm run build`
3. `pnpm run deploy`

## 検証
- `pnpm run typecheck` 成功
- `pnpm run build` 成功

## Figma準拠について
- Figma MCP で `manabi-labs-design` を直接取得するには対象 `fileKey/nodeId` が必要。
- 今回は既存実装で使用済みのデザイン値（Rounded Mplus 1c, 既存カラー）をトークン化し、追従可能な構造に整理。
- `fileKey/nodeId` が共有され次第、`tokens.css` の値をFigma実値へ即時置換可能。
