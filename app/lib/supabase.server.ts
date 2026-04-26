import { createClient } from "@supabase/supabase-js";
import {
  getLocalTestArticleById,
  getLocalTestArticles,
  searchLocalTestArticles
} from "../data/test-articles";
import {
  buildSourceName,
  inferCategory,
  mapCorpusDocumentToArticle,
  type Category,
  type CorpusDocument,
  type ViewArticle
} from "./corpus.mapper";

function normalizeRuntimeValue(value: string | undefined) {
  if (!value) return "";
  if (value.startsWith("__") && value.endsWith("__")) return "";
  return value;
}

function readRuntimeEnv() {
  if (typeof window === "undefined") {
    return { supabaseUrl: "", supabaseKey: "" };
  }

  const appEnv = window.__APP_ENV__;
  return {
    supabaseUrl: normalizeRuntimeValue(appEnv?.SUPABASE_URL),
    supabaseKey: normalizeRuntimeValue(appEnv?.SUPABASE_KEY)
  };
}

const runtimeEnv = readRuntimeEnv();
const supabaseUrl =
  runtimeEnv.supabaseUrl ||
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL;
const supabaseKey =
  runtimeEnv.supabaseKey ||
  import.meta.env.VITE_SUPABASE_KEY ||
  import.meta.env.SUPABASE_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export type StudySite = {
  id: string;
  label: string;
  url: string;
};

const STUDY_LINK_SOURCE_PREFIX = "study-link/";

async function fetchDocumentsByCategory(
  category: Category
): Promise<{ data: CorpusDocument[] | null; error: boolean }> {
  if (!supabase) return { data: null, error: true };

  if (category === "knowledge") {
    // 旧データは source_name にカテゴリ接頭辞が無いので、knowledge は全件から判定する
    const { data, error } = await supabase
      .from("corpus_documents")
      .select("id,source_name,content,created_at,updated_at")
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error || !data) return { data: null, error: true };
    const filtered = (data as CorpusDocument[]).filter(
      (doc) => inferCategory(doc.source_name ?? "") === "knowledge"
    );
    return { data: filtered, error: false };
  }

  const prefix = category === "articles" ? "articles/" : "study/";
  const { data, error } = await supabase
    .from("corpus_documents")
    .select("id,source_name,content,created_at,updated_at")
    .like("source_name", `${prefix}%`)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error || !data) return { data: null, error: true };
  return { data: data as CorpusDocument[], error: false };
}

export type ListArticlesResult = {
  items: ViewArticle[];
  error: string | null;
  isConfigured: boolean;
};

export function isSupabaseReady() {
  return Boolean(supabase);
}

function normalizeStudySiteInput(input: {
  label: string;
  url: string;
}): { label: string; url: string } | null {
  const label = input.label.trim();
  const rawUrl = input.url.trim();
  if (!label || !rawUrl) return null;

  let normalizedUrl = rawUrl;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const parsed = new URL(normalizedUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return { label, url: parsed.toString() };
  } catch {
    return null;
  }
}

function parseStudySite(doc: CorpusDocument): StudySite | null {
  try {
    const parsed = JSON.parse(doc.content) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof (parsed as { label?: unknown }).label !== "string" ||
      typeof (parsed as { url?: unknown }).url !== "string"
    ) {
      return null;
    }

    return {
      id: doc.id,
      label: (parsed as { label: string }).label,
      url: (parsed as { url: string }).url
    };
  } catch {
    return null;
  }
}

export async function listArticles(category: Category): Promise<ViewArticle[]> {
  const localItems = getLocalTestArticles(category);
  if (!supabase) return localItems;
  const { data, error } = await fetchDocumentsByCategory(category);
  if (error || !data) return localItems;
  const remoteItems = data.map(mapCorpusDocumentToArticle);
  return [...localItems, ...remoteItems];
}

export async function listArticlesWithStatus(
  category: Category
): Promise<ListArticlesResult> {
  if (!supabase) {
    return {
      items: getLocalTestArticles(category),
      error: null,
      isConfigured: false
    };
  }

  const { data, error } = await fetchDocumentsByCategory(category);
  if (error || !data) {
    return {
      items: getLocalTestArticles(category),
      error: "データ取得に失敗しました",
      isConfigured: true
    };
  }

  const localItems = getLocalTestArticles(category);
  const remoteItems = data.map(mapCorpusDocumentToArticle);
  return {
    items: [...localItems, ...remoteItems],
    error: null,
    isConfigured: true
  };
}

export async function getArticle(id: string): Promise<ViewArticle | null> {
  const localItem = getLocalTestArticleById(id);
  if (localItem) return localItem;
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("corpus_documents")
    .select("id,source_name,content,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapCorpusDocumentToArticle(data as CorpusDocument);
}

export async function createArticle(input: {
  category: Category;
  title: string;
  body: string;
}): Promise<string | null> {
  if (!supabase) return null;
  const content = `# ${input.title}\n\n${input.body.trim()}`;
  const idSeed = crypto.randomUUID();
  const source_name = buildSourceName(input.category, idSeed);

  const { data, error } = await supabase
    .from("corpus_documents")
    .insert({ source_name, content })
    .select("id")
    .single();

  if (error || !data) return null;
  return data.id as string;
}

export async function updateArticle(
  id: string,
  input: { title: string; body: string }
): Promise<boolean> {
  if (!supabase) return false;
  const content = `# ${input.title}\n\n${input.body.trim()}`;
  const { error } = await supabase
    .from("corpus_documents")
    .update({ content })
    .eq("id", id);
  return !error;
}

export async function searchArticles(keyword: string): Promise<ViewArticle[]> {
  const localItems = searchLocalTestArticles(keyword);
  if (!supabase || !keyword.trim()) return localItems;

  const escaped = keyword.trim();
  const { data, error } = await supabase
    .from("corpus_documents")
    .select("id,source_name,content,created_at,updated_at")
    .or(`source_name.ilike.%${escaped}%,content.ilike.%${escaped}%`)
    .order("updated_at", { ascending: false })
    .limit(30);

  if (error || !data) return localItems;
  const remoteItems = (data as CorpusDocument[]).map(mapCorpusDocumentToArticle);
  return [...localItems, ...remoteItems];
}

export async function listStudySites(): Promise<StudySite[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("corpus_documents")
    .select("id,source_name,content,created_at,updated_at")
    .like("source_name", `${STUDY_LINK_SOURCE_PREFIX}%`)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error || !data) return [];

  return (data as CorpusDocument[])
    .map(parseStudySite)
    .filter((site): site is StudySite => site !== null);
}

export async function createStudySite(input: {
  label: string;
  url: string;
}): Promise<boolean> {
  if (!supabase) return false;
  const normalized = normalizeStudySiteInput(input);
  if (!normalized) return false;

  const source_name = `${STUDY_LINK_SOURCE_PREFIX}${crypto.randomUUID()}.json`;
  const content = JSON.stringify(normalized);
  const { error } = await supabase
    .from("corpus_documents")
    .insert({ source_name, content });

  return !error;
}
