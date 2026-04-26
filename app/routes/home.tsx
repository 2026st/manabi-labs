import { useEffect, useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { listKnowledge } from "../lib/knowledge.repository";
import type { ViewArticle } from "../lib/corpus.mapper";

export default function HomeRoute() {
  const [items, setItems] = useState<ViewArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listKnowledge().then((result) => {
      setItems(result.items);
      setIsConfigured(result.isConfigured);
      setError(result.error);
      setIsLoading(false);
    });
  }, []);

  return (
    <section className="section">
      <h2>知識の箱</h2>
      <div className="article-list">
        {isLoading && <p className="notice">読み込み中です</p>}
        {!isConfigured && !isLoading && (
          <p className="notice">Supabaseの環境変数を設定してください</p>
        )}
        {error && !isLoading && <p className="notice notice--error">{error}</p>}
        {items.map((item) => (
          <ArticleCard
            key={item.id}
            id={item.id}
            title={item.title}
            dateLabel={item.dateLabel}
          />
        ))}
        {items.length === 0 && !isLoading && isConfigured && !error && (
          <p className="notice">表示できる記事がありません</p>
        )}
      </div>
    </section>
  );
}
