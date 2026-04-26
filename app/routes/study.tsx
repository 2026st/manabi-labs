import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listStudySites,
  type StudySite
} from "../lib/supabase.server";

const DEFAULT_SITES: StudySite[] = [
  {
    id: "fe-kakomon",
    label: "基本情報技術者過去問道場",
    url: "https://www.fe-siken.com/fekakomon.php"
  }
];

export default function StudyRoute() {
  const [sites, setSites] = useState<StudySite[]>([]);

  useEffect(() => {
    let disposed = false;
    async function load() {
      const remoteSites = await listStudySites();
      if (disposed) return;
      setSites([...DEFAULT_SITES, ...remoteSites]);
    }
    load();
    return () => {
      disposed = true;
    };
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
