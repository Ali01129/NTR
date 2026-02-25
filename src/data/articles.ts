import type { Article, Category } from "@/types";
import type { ArticleRow } from "@/types/database";
import { supabase, supabaseAdmin, isSupabaseConfigured, isSupabaseAdminConfigured } from "@/lib/supabase/server";
import {
  getAllArticles as getDummyAll,
  getArticleBySlug as getDummyBySlug,
  getArticlesByCategory as getDummyByCategory,
  categories as dummyCategories,
} from "@/data/dummy";

function rowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    categorySlug: row.category_slug,
    author: row.author,
    publishedAt: row.published_at,
    image: row.image,
    imageAlt: row.image_alt ?? undefined,
    featured: row.featured ?? undefined,
    readTime: row.read_time ?? undefined,
    body: row.body ?? undefined,
  };
}

/** Fetch all articles from Supabase, or fallback to dummy data. */
export async function getAllArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getDummyAll();
  }
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) {
    console.error("[articles] getAllArticles error:", error.message);
    return getDummyAll();
  }
  return (data as ArticleRow[]).map(rowToArticle);
}

/** Get one article by slug from Supabase, or fallback to dummy. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured() || !supabase) {
    return getDummyBySlug(slug);
  }
  const normalized = slug.trim().toLowerCase();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .ilike("slug", normalized)
    .maybeSingle();
  if (error) {
    console.error("[articles] getArticleBySlug error:", error.message);
    return getDummyBySlug(slug);
  }
  return data ? rowToArticle(data as ArticleRow) : null;
}

/** Get one article by id (for admin update). */
export async function getArticleById(id: string): Promise<Article | null> {
  if (!isSupabaseConfigured() || !supabase) return null;
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) return null;
  return data ? rowToArticle(data as ArticleRow) : null;
}

/** Get articles in the same category from Supabase, or fallback to dummy. */
export async function getArticlesByCategory(
  categorySlug: string,
  options?: { excludeId?: string; limit?: number }
): Promise<Article[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return getDummyByCategory(categorySlug, options);
  }
  const slug = categorySlug.trim().toLowerCase();
  const limit = options?.limit ?? 6;
  let query = supabase
    .from("articles")
    .select("*")
    .ilike("category_slug", slug)
    .order("published_at", { ascending: false })
    .limit(limit + (options?.excludeId ? 1 : 0));
  if (options?.excludeId) {
    query = query.neq("id", options.excludeId);
  }
  const { data, error } = await query;
  if (error) {
    console.error("[articles] getArticlesByCategory error:", error.message);
    return getDummyByCategory(categorySlug, options);
  }
  const list = (data as ArticleRow[]).map(rowToArticle).slice(0, limit);
  return list;
}

/** Categories: from Supabase if available, else dummy. */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured() || !supabase) {
    return dummyCategories;
  }
  const { data, error } = await supabase.from("categories").select("slug, name").order("slug");
  if (error || !data?.length) {
    return dummyCategories;
  }
  return data.map((r: { slug: string; name: string }) => ({ slug: r.slug, name: r.name }));
}

/** Insert a new article into Supabase. Fails if Supabase is not configured. */
export type CreateArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt?: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
  readTime?: number;
  body?: string;
};

export async function createArticle(input: CreateArticleInput): Promise<{ ok: true; article: Article } | { ok: false; error: string }> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return { ok: false, error: "Supabase admin (service role) is not configured. Set SUPABASE_SERVICE_ROLE_KEY for admin create." };
  }
  const { error, data } = await supabaseAdmin
    .from("articles")
    .insert({
      slug: input.slug.trim(),
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      category: input.category.trim(),
      category_slug: input.categorySlug.trim().toLowerCase(),
      author: input.author.trim(),
      published_at: input.publishedAt ?? new Date().toISOString(),
      image: input.image.trim(),
      image_alt: input.imageAlt?.trim() ?? null,
      featured: input.featured ?? false,
      read_time: input.readTime ?? null,
      body: input.body?.trim() ?? null,
    })
    .select()
    .single();
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, article: rowToArticle(data as ArticleRow) };
}

/** Update an existing article by id. */
export type UpdateArticleInput = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
  readTime?: number;
  body?: string;
};

export async function updateArticle(
  id: string,
  input: UpdateArticleInput
): Promise<{ ok: true; article: Article } | { ok: false; error: string }> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return { ok: false, error: "Supabase admin (service role) is not configured. Set SUPABASE_SERVICE_ROLE_KEY for admin update." };
  }
  const { error, data } = await supabaseAdmin
    .from("articles")
    .update({
      slug: input.slug.trim(),
      title: input.title.trim(),
      excerpt: input.excerpt.trim(),
      category: input.category.trim(),
      category_slug: input.categorySlug.trim().toLowerCase(),
      author: input.author.trim(),
      image: input.image.trim(),
      image_alt: input.imageAlt?.trim() ?? null,
      featured: input.featured ?? false,
      read_time: input.readTime ?? null,
      body: input.body?.trim() ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) {
    return { ok: false, error: error.message };
  }
  if (!data) {
    return { ok: false, error: "No row was updated. The article may not exist." };
  }
  return { ok: true, article: rowToArticle(data as ArticleRow) };
}
