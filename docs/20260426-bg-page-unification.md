## 変更内容
- `app/styles/tokens.css` から `--color-bg-surface` を削除。
- `--color-bg-page` の値を `#fefefe` に変更。
- `app/styles/global.css` の `var(--color-bg-surface)` をすべて `var(--color-bg-page)` に置換。
- `app/styles/global.css` の `var(--color-line)` を `var(--color-text-sub)` に置換。
- `app/styles/tokens.css` から `--color-line` を削除。
- `app/styles/tokens.css` の `--color-card-icon` を `--color-secondary` に改名。

## 意図
- 背景色トークンを `--color-bg-page` に一本化して、トークンの役割を単純化するため。

## 具体例
- 変更前: `.page { background: var(--color-bg-surface); }`
- 変更後: `.page { background: var(--color-bg-page); }`
