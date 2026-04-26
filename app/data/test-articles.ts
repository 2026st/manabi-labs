import type { Category, ViewArticle } from "../lib/corpus.mapper";

const TEST_ARTICLES: ViewArticle[] = [];

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
