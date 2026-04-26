import type { Category, ViewArticle } from "../lib/corpus.mapper";

const today = new Date();
const yyyy = today.getFullYear();
const mm = `${today.getMonth() + 1}`.padStart(2, "0");
const dd = `${today.getDate()}`.padStart(2, "0");
const dateLabel = `${yyyy}/${mm}/${dd}`;

const TEST_ARTICLES: ViewArticle[] = [
  {
    id: "local-test-article-001",
    title: "テスト記事（ローカル）",
    body: `# テスト記事（ローカル）

このページはプロジェクト内データから表示しています。
Supabaseに接続していなくても一覧・詳細で確認できます。`,
    dateLabel,
    category: "articles",
    sourceName: "articles/local-test-article-001.md"
  }
];

export function getLocalTestArticles(category: Category): ViewArticle[] {
  return TEST_ARTICLES.filter((item) => item.category === category);
}

export function getLocalTestArticleById(id: string): ViewArticle | null {
  return TEST_ARTICLES.find((item) => item.id === id) ?? null;
}

export function searchLocalTestArticles(keyword: string): ViewArticle[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return [];
  return TEST_ARTICLES.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.body.toLowerCase().includes(q) ||
      item.sourceName.toLowerCase().includes(q)
    );
  });
}
