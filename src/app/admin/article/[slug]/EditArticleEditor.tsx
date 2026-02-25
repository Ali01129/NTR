"use client";

import { useActionState, useCallback, useState } from "react";
import { updateArticleAction } from "@/app/actions/articles";
import { ArticlePreview, type PreviewData } from "@/app/admin/new-article/ArticlePreview";
import type { Article } from "@/types";
import Link from "next/link";

const CATEGORIES = [
  { name: "Movies", slug: "movies" },
  { name: "TV", slug: "tv" },
  { name: "Gaming", slug: "gaming" },
  { name: "Tech", slug: "tech" },
  { name: "Culture", slug: "culture" },
];

const initialState: { ok: true; message: string } | { ok: false; error: string } | null = null;

function articleToPreviewData(a: Article): PreviewData {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    body: a.body ?? "",
    category: a.category,
    categorySlug: a.categorySlug ?? "",
    author: a.author,
    image: a.image,
    imageAlt: a.imageAlt ?? "",
    readTime: a.readTime != null ? String(a.readTime) : "",
    featured: a.featured ?? false,
  };
}

export function EditArticleEditor({ article }: { article: Article }) {
  const [state, formAction] = useActionState(updateArticleAction, initialState);
  const [preview, setPreview] = useState<PreviewData>(() => articleToPreviewData(article));

  const updatePreview = useCallback((field: keyof PreviewData, value: string | boolean) => {
    setPreview((p) => ({ ...p, [field]: value }));
  }, []);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ArticlePreview data={preview} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Article details</h3>
        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="id" value={article.id} />
          {state?.ok === true && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-200">
              {state.message}
            </div>
          )}
          {state?.ok === false && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="edit-slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Slug (URL path) *
            </label>
            <input
              id="edit-slug"
              name="slug"
              type="text"
              required
              placeholder="my-article-title"
              value={preview.slug}
              onChange={(e) => updatePreview("slug", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title *
            </label>
            <input
              id="edit-title"
              name="title"
              type="text"
              required
              placeholder="Article title"
              value={preview.title}
              onChange={(e) => updatePreview("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-excerpt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Excerpt *
            </label>
            <textarea
              id="edit-excerpt"
              name="excerpt"
              rows={3}
              required
              placeholder="Short summary"
              value={preview.excerpt}
              onChange={(e) => updatePreview("excerpt", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-body" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Article body *
            </label>
            <textarea
              id="edit-body"
              name="body"
              rows={12}
              required
              placeholder="Full article text..."
              value={preview.body}
              onChange={(e) => updatePreview("body", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                id="edit-category"
                name="category"
                required
                value={preview.category}
                onChange={(e) => updatePreview("category", e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-categorySlug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category slug
              </label>
              <input
                id="edit-categorySlug"
                name="categorySlug"
                type="text"
                placeholder="movies"
                defaultValue={article.categorySlug}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="edit-author" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Author *
            </label>
            <input
              id="edit-author"
              name="author"
              type="text"
              required
              placeholder="Author name"
              value={preview.author}
              onChange={(e) => updatePreview("author", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image URL *
            </label>
            <input
              id="edit-image"
              name="image"
              type="url"
              required
              placeholder="https://..."
              value={preview.image}
              onChange={(e) => updatePreview("image", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-imageAlt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image alt text
            </label>
            <input
              id="edit-imageAlt"
              name="imageAlt"
              type="text"
              placeholder="Describe the image"
              value={preview.imageAlt}
              onChange={(e) => updatePreview("imageAlt", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="edit-readTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Read time (minutes)
            </label>
            <input
              id="edit-readTime"
              name="readTime"
              type="number"
              min={1}
              placeholder="5"
              value={preview.readTime}
              onChange={(e) => updatePreview("readTime", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="edit-featured"
              name="featured"
              type="checkbox"
              checked={preview.featured}
              onChange={(e) => updatePreview("featured", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <label htmlFor="edit-featured" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Featured
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Update article
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Back to dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
