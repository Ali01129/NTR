"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createArticleAction } from "@/app/actions/articles";
import { generateArticleWithAIAction } from "@/app/actions/generate-article-ai";
import { ArticlePreview, type PreviewData } from "./ArticlePreview";
import Link from "next/link";

const CATEGORIES = [
  { name: "Movies", slug: "movies" },
  { name: "TV", slug: "tv" },
  { name: "Gaming", slug: "gaming" },
  { name: "Tech", slug: "tech" },
  { name: "Culture", slug: "culture" },
];

const initialState: { ok: true; message: string } | { ok: false; error: string } | null = null;

export function NewArticleEditor() {
  const router = useRouter();
  const [state, formAction] = useActionState(createArticleAction, initialState);
  const [preview, setPreview] = useState<PreviewData>({
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    category: CATEGORIES[0].name,
    categorySlug: CATEGORIES[0].slug,
    author: "ntr",
    image: "",
    imageAlt: "",
    readTime: "",
    featured: false,
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const updatePreview = useCallback((field: keyof PreviewData, value: string | boolean) => {
    setPreview((p) => ({ ...p, [field]: value }));
  }, []);

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin");
    }
  }, [state?.ok, router]);

  const handleGenerateWithAI = useCallback(async () => {
    setAiError(null);
    setIsGenerating(true);
    try {
      const result = await generateArticleWithAIAction(aiPrompt);
      if (result.ok) {
        setPreview((p) => ({
          ...p,
          slug: result.data.slug,
          title: result.data.title,
          excerpt: result.data.excerpt,
          body: result.data.body,
          category: result.data.category,
          categorySlug: result.data.categorySlug,
          author: result.data.author,
          image: result.data.image,
          imageAlt: result.data.imageAlt,
          readTime: result.data.readTime,
        }));
      } else {
        setAiError(result.error);
      }
    } finally {
      setIsGenerating(false);
    }
  }, [aiPrompt]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <ArticlePreview data={preview} />
      </div>

      {/* Right: form */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Article details</h2>

        {/* Create with AI */}
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Create with AI</h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Describe the article you want; AI will fill slug, title, excerpt, body, category, image URL, and read time. You can edit any field after.
          </p>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. A short review of the latest sci-fi movie, casual tone, 3 key points and a verdict."
            rows={4}
            disabled={isGenerating}
            className="mt-3 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 disabled:opacity-60"
          />
          {aiError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{aiError}</p>
          )}
          <button
            type="button"
            onClick={handleGenerateWithAI}
            disabled={isGenerating || !aiPrompt.trim()}
            className="mt-3 rounded-lg bg-zinc-800 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            {isGenerating ? "Generating…" : "Generate article"}
          </button>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          <input type="hidden" name="author" value="ntr" />
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
            <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Slug (URL path) *
            </label>
            <input
              id="slug"
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
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title *
            </label>
            <input
              id="title"
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
            <label htmlFor="excerpt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Excerpt *
            </label>
            <textarea
              id="excerpt"
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
            <label htmlFor="body" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Article body *
            </label>
            <textarea
              id="body"
              name="body"
              rows={12}
              required
              placeholder="Write the full article text here. Paragraphs are separated by blank lines."
              value={preview.body}
              onChange={(e) => updatePreview("body", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={preview.category}
                onChange={(e) => {
                  const name = e.target.value;
                  const cat = CATEGORIES.find((c) => c.name === name);
                  setPreview((p) => ({
                    ...p,
                    category: name,
                    categorySlug: cat ? cat.slug : name.toLowerCase().replace(/\s+/g, "-"),
                  }));
                }}
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
              <label htmlFor="categorySlug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Category slug
              </label>
              <input
                id="categorySlug"
                name="categorySlug"
                type="text"
                placeholder="movies"
                value={preview.categorySlug}
                onChange={(e) => updatePreview("categorySlug", e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image URL *
            </label>
            <input
              id="image"
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
            <label htmlFor="imageAlt" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image alt text
            </label>
            <input
              id="imageAlt"
              name="imageAlt"
              type="text"
              placeholder="Describe the image"
              value={preview.imageAlt}
              onChange={(e) => updatePreview("imageAlt", e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400"
            />
          </div>
          <div>
            <label htmlFor="readTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Read time (minutes)
            </label>
            <input
              id="readTime"
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
              id="featured"
              name="featured"
              type="checkbox"
              checked={preview.featured}
              onChange={(e) => updatePreview("featured", e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
            />
            <label htmlFor="featured" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Featured
            </label>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Create article
            </button>
            <Link
              href="/admin"
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
