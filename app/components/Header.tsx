import { Link, useLocation } from "react-router-dom";
import { figmaAssets } from "../lib/figma-assets";

const tabs = [
  { label: "知識の箱", to: "/" },
  { label: "みんなの記事", to: "/articles" },
  { label: "勉強サイト", to: "/study" }
];

export function Header({ paper = false }: { paper?: boolean }) {
  const location = useLocation();
  const active = tabs.find((tab) => tab.to === location.pathname)?.to;

  return (
    <header className={`header ${paper ? "header--paper" : ""}`}>
      <div className="header__top">
        <Link to="/" className="brand" aria-label="まなびログ トップへ">
          <img className="brand__logo" src={figmaAssets.logo.mark} alt="" aria-hidden />
          <span className="brand__wordmark">
            <img className="brand__accent" src={figmaAssets.logo.accent} alt="" aria-hidden />
            <span className="brand__text">まなびログ</span>
          </span>
        </Link>
        <div className="header__actions">
          <Link to="/search" className="icon-btn" aria-label="検索">
            <img src={figmaAssets.icons.search} alt="" />
          </Link>
          <Link to="/new" className="icon-btn" aria-label="新規作成">
            <img className="pencil-icon" src={figmaAssets.icons.pencil} alt="" aria-hidden />
          </Link>
        </div>
      </div>
      {!paper && (
        <nav className="tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`tab ${active === tab.to ? "tab--active" : ""}`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
