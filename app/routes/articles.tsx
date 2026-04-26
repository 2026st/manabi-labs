import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { listArticles } from "../lib/supabase.server";
import type { ViewArticle } from "../lib/corpus.mapper";

export default function ArticlesRoute() {
  const [items, setItems] = useState<ViewArticle[]>([]);

  useEffect(() => {
    void listArticles("articles").then(setItems);
  }, []);

  return (
    <section className="section">
      <h2>みんなの記事</h2>
      <div className="article-list">
        {items.map((item) => (
          <ArticleCard
            key={item.id}
            id={item.id}
            title={item.title}
            dateLabel={item.dateLabel}
          />
        ))}
        {items.length === 0 && (
          <p className="notice">表示できる記事がありません</p>
        )}
      </div>
    </section>
  );
}
