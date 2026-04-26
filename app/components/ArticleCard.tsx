import { Link } from "react-router-dom";
import { figmaAssets } from "../lib/figma-assets";

export function ArticleCard(props: {
  id: string;
  title: string;
  dateLabel: string;
}) {
  return (
    <Link to={`/article/${props.id}`} className="article-card">
      <span className="article-card__icon" aria-hidden>
        <img src={figmaAssets.icons.articleFile} alt="" />
      </span>
      <span className="article-card__content">
        <span className="article-card__title">{props.title}</span>
        <span className="article-card__date">{props.dateLabel}</span>
      </span>
    </Link>
  );
}
