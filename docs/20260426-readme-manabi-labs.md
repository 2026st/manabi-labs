# README 作成（まなびラボ）

## 変更内容

- プロジェクトルートに `README.md` を新規作成。
- 目的、機能、技術スタック、ディレクトリ構成、セットアップ、環境変数、デプロイ手順、注意点を整理。
- 実装に合わせて `source_name` 命名規約と Cloudflare Worker のランタイム環境変数注入の前提を明記。

## なぜ必要か

- 初回セットアップ時に「何をどこまで設定すれば動くか」が分かりにくく、特に Supabase と Cloudflare の前提を知らないと動作確認で詰まりやすいため。

## 選択理由

- KISS: README 1ファイルに最低限必要な導線を集約し、最短で起動できる内容に限定。
- YAGNI: 未実装の機能や将来の構想は書かず、現行コードで確認できる事実のみ記載。
- DRY: `docs` に散在していた運用上の注意（SPA リロード対策、本番 env 注入）を README 側へ再利用可能な形で要約。

## 具体例

- 例1: `.env` に `SUPABASE_URL`/`SUPABASE_KEY` を設定せずに `pnpm run dev` すると、一覧が空になり作成処理は失敗する。
- 例2: Cloudflare 側で `run_worker_first = true` を外すと、`window.__APP_ENV__` 置換が走らず本番で Supabase 接続に失敗しうる。
