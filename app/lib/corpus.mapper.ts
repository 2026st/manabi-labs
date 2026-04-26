export type Category = "knowledge" | "articles" | "study";

export type CorpusDocument = {
  id: string;
  source_name: string;
  content: string;
  created_at?: string;
  updated_at?: string;
};

export type ViewArticle = {
  id: string;
  title: string;
  body: string;
  dateLabel: string;
  category: Category;
  sourceName: string;
};

export function inferCategory(sourceName: string): Category {
  if (sourceName.startsWith("articles/")) return "articles";
  if (sourceName.startsWith("study/")) return "study";
  return "knowledge";
}

export function buildSourceName(category: Category, id: string): string {
  return `${category}/${id}.md`;
}

export function extractTitle(content: string): string {
  const first = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.length > 0);

  if (!first) return "無題の記事";
  const normalized = first.replace(/^#+\s*/, "").trim();
  if (normalized.length <= 30) return normalized;
  return `${normalized.slice(0, 30)}...`;
}

export function toDateLabel(value?: string): string {
  if (!value) return "----/--/--";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "----/--/--";
  const yyyy = d.getFullYear();
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

export function mapCorpusDocumentToArticle(doc: CorpusDocument): ViewArticle {
  return {
    id: doc.id,
    title: extractTitle(doc.content),
    body: doc.content,
    dateLabel: toDateLabel(doc.updated_at ?? doc.created_at),
    category: inferCategory(doc.source_name ?? ""),
    sourceName: doc.source_name ?? ""
  };
}
