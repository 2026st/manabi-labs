import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { figmaAssets } from "../lib/figma-assets";

const tabs = [
  { label: "知識の箱", to: "/" },
  { label: "みんなの記事", to: "/articles" },
  { label: "勉強サイト", to: "/study" }
];
const THEME_STORAGE_KEY = "manabi-theme";
const DARK_THEME_CLASS = "theme-dark";

export function Header({ paper = false }: { paper?: boolean }) {
  const location = useLocation();
  const active = tabs.find((tab) => tab.to === location.pathname)?.to;
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    setIsDarkTheme(document.documentElement.classList.contains(DARK_THEME_CLASS));
  }, []);

  const toggleTheme = () => {
    const nextThemeDark = !document.documentElement.classList.contains(DARK_THEME_CLASS);
    document.documentElement.classList.toggle(DARK_THEME_CLASS, nextThemeDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextThemeDark ? "dark" : "light");
    setIsDarkTheme(nextThemeDark);
  };

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
          <button
            type="button"
            className="icon-btn"
            aria-label="テーマカラー変更"
            aria-pressed={isDarkTheme}
            onClick={toggleTheme}
          >
            <PaletteOutlinedIcon className="icon-btn__svg" />
          </button>
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
