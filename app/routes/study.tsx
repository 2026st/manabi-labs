import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listStudySites, type StudySite } from "../lib/study-sites";

export default function StudyRoute() {
  const [sites, setSites] = useState<StudySite[]>([]);

  useEffect(() => {
    setSites(listStudySites());
  }, []);

  return (
    <section className="section">
      <h2>勉強サイト</h2>
      <div className="action-row">
        <Link to="/study/new" className="btn btn--primary">
          サイトを追加
        </Link>
      </div>
      <div className="article-list">
        {sites.map((site) => (
          <a
            key={site.id}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-card"
          >
            <span className="article-card__content">
              <span className="article-card__title">{site.label}</span>
              <span className="article-card__date">{site.url}</span>
            </span>
          </a>
        ))}
        {sites.length === 0 && (
          <p className="notice">表示できる勉強サイトがありません</p>
        )}
      </div>
    </section>
  );
}
