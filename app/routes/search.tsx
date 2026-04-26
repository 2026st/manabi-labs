import { useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { searchArticles } from "../lib/supabase.server";
import type { ViewArticle } from "../lib/corpus.mapper";
import { figmaAssets } from "../lib/figma-assets";

export default function SearchRoute() {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<ViewArticle[]>([]);

  async function onSearch(value: string) {
    setKeyword(value);
    const result = await searchArticles(value);
    setItems(result);
  }

  return (
    <section className="section">
      <div className="search-box">
        <img className="search-box__icon" src={figmaAssets.icons.search} alt="" aria-hidden />
        <input
          className="search-input"
          value={keyword}
          onChange={(event) => void onSearch(event.target.value)}
          placeholder="キーワードで検索"
        />
      </div>
      <div className="article-list">
        {items.map((item) => (
          <ArticleCard
            key={item.id}
            id={item.id}
            title={item.title}
            dateLabel={item.dateLabel}
          />
        ))}
      </div>
    </section>
  );
}
