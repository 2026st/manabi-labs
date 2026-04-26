# SPAリロード時の白画面修正

## 事象
- 直接URLへアクセスした状態でブラウザをリロードすると、画面が白くなりページ表示できない。

## 原因
- Cloudflare Worker (`worker.mjs`) が静的アセットをそのまま返すだけの実装だった。
- SPAでは `/article/123` のようなパスは実ファイルではないため、リロード時にアセット解決が404になり、`index.html` へフォールバックされない。

## 実装内容
- `worker.mjs` にSPAフォールバック処理を追加。
- `env.ASSETS.fetch(request)` の結果が404のとき、以下条件を満たす場合に `index.html` を返す:
  - `GET` リクエスト
  - `Accept` ヘッダに `text/html` を含む
  - パスが拡張子付きファイルではない（例: `.js`, `.css`, `.png` ではない）

## 具体例
- `/article/abc` を直接開いてリロード:
  - 修正前: 404起因で白画面
  - 修正後: `index.html` が返り、クライアントルーターが `/article/abc` を描画
- `/assets/index.js` の取得失敗:
  - 修正後も `index.html` にフォールバックせず、元の404を保持

## 検証
- `pnpm run build` 成功
- `worker.mjs` のlintエラーなし
