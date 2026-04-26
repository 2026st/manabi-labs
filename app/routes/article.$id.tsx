import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getArticle } from "../lib/supabase.server";
import type { ViewArticle } from "../lib/corpus.mapper";

function linkifyBodyText(text: string): string {
  return text.replace(/(https?:\/\/[^\s]+)/g, "[$1]($1)");
}

export default function ArticleDetailRoute() {
  const { id = "" } = useParams();
  const [item, setItem] = useState<ViewArticle | null>(null);

  useEffect(() => {
    if (!id) return;
    void getArticle(id).then(setItem);
  }, [id]);

  return (
    <section className="paper-body">
      <div className="action-row">
        <Link to={`/article/${id}/edit`} className="btn btn--primary">
          編集する
        </Link>
      </div>
      <h2 className="title-display">{item?.title ?? "記事が見つかりません"}</h2>
      <p className="date-display">{item?.dateLabel ?? "----/--/--"}</p>
      <div className="body-display body-display--plain">
        <div className="markdown-body">
          <ReactMarkdown
            components={{
              a: ({ node: _node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" />
              ),
            }}
          >
            {linkifyBodyText(item?.body ?? "本文データはありません。")}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}
