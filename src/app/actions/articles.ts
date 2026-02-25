"use server";

import { createArticle, updateArticle, getArticleById } from "@/data/articles";
import { revalidatePath } from "next/cache";
import { isAdminLoggedIn } from "@/lib/auth-admin";

export type CreateArticleState = { ok: true; message: string } | { ok: false; error: string };
export type UpdateArticleState = { ok: true; message: string } | { ok: false; error: string };

export async function createArticleAction(
  _prev: CreateArticleState | null,
  formData: FormData
): Promise<CreateArticleState> {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    return { ok: false, error: "You must be logged in to create articles." };
  }

  const slug = (formData.get("slug") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const categorySlug = (formData.get("categorySlug") as string)?.trim().toLowerCase() || category?.toLowerCase().replace(/\s+/g, "-");
  const author = (formData.get("author") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const imageAlt = (formData.get("imageAlt") as string)?.trim() || undefined;
  const readTimeStr = (formData.get("readTime") as string)?.trim();
  const readTime = readTimeStr ? parseInt(readTimeStr, 10) : undefined;
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const body = (formData.get("body") as string)?.trim() || undefined;

  if (!slug || !title || !excerpt || !category || !author || !image) {
    return { ok: false, error: "Missing required fields: slug, title, excerpt, category, author, image." };
  }
  if (!body) {
    return { ok: false, error: "Article body is required." };
  }

  const result = await createArticle({
    slug,
    title,
    excerpt,
    category,
    categorySlug: categorySlug || category.toLowerCase().replace(/\s+/g, "-"),
    author,
    image,
    imageAlt,
    featured,
    readTime: readTime && Number.isFinite(readTime) ? readTime : undefined,
    body,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/article/${result.article.slug}`);
  revalidatePath("/sitemap.xml");

  return { ok: true, message: `Article "${result.article.title}" created. View: /article/${result.article.slug}` };
}

export async function updateArticleAction(
  _prev: UpdateArticleState | null,
  formData: FormData
): Promise<UpdateArticleState> {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    return { ok: false, error: "You must be logged in to update articles." };
  }

  const id = (formData.get("id") as string)?.trim();
  if (!id) return { ok: false, error: "Missing article id." };

  const existing = await getArticleById(id);
  if (!existing) return { ok: false, error: "Article not found." };

  const slug = (formData.get("slug") as string)?.trim();
  const title = (formData.get("title") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const category = (formData.get("category") as string)?.trim();
  const categorySlug = (formData.get("categorySlug") as string)?.trim().toLowerCase() || category?.toLowerCase().replace(/\s+/g, "-");
  const author = (formData.get("author") as string)?.trim();
  const image = (formData.get("image") as string)?.trim();
  const imageAlt = (formData.get("imageAlt") as string)?.trim() || undefined;
  const readTimeStr = (formData.get("readTime") as string)?.trim();
  const readTime = readTimeStr ? parseInt(readTimeStr, 10) : undefined;
  const featured = formData.get("featured") === "on" || formData.get("featured") === "true";
  const body = (formData.get("body") as string)?.trim() || undefined;

  if (!slug || !title || !excerpt || !category || !author || !image) {
    return { ok: false, error: "Missing required fields: slug, title, excerpt, category, author, image." };
  }
  if (!body) {
    return { ok: false, error: "Article body is required." };
  }

  const result = await updateArticle(id, {
    slug,
    title,
    excerpt,
    category,
    categorySlug: categorySlug || category.toLowerCase().replace(/\s+/g, "-"),
    author,
    image,
    imageAlt,
    featured,
    readTime: readTime && Number.isFinite(readTime) ? readTime : undefined,
    body,
  });

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  revalidatePath("/");
  revalidatePath("/articles");
  revalidatePath(`/article/${existing.slug}`);
  revalidatePath(`/article/${result.article.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath(`/admin/article/${existing.slug}`);
  revalidatePath(`/admin/article/${result.article.slug}`);

  return { ok: true, message: `Article "${result.article.title}" updated.` };
}
