import {
  listArticlesWithStatus,
  type ListArticlesResult
} from "./supabase.server";

export async function listKnowledge(): Promise<ListArticlesResult> {
  return listArticlesWithStatus("knowledge");
}
