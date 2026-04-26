# 勉強サイトリンクを知識の箱から除外

## 問題
- `study-link/` 形式で保存した勉強サイトリンクが、知識の箱ページにも表示されていた。

## 原因
- `inferCategory()` が `study-link/` を明示判定しておらず、デフォルトの `knowledge` 扱いになっていた。

## 対応
- `app/lib/corpus.mapper.ts` の `inferCategory()` に以下を追加:
  - `sourceName.startsWith("study-link/")` のとき `study` を返す

## 影響
- 知識の箱ページ: `study-link/` データは表示されない
- 勉強サイトページ: 従来どおり表示される
