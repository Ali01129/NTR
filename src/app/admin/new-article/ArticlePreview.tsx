"use client";

import Image from "next/image";

export type PreviewData = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categorySlug: string;
  author: string;
  image: string;
  imageAlt: string;
  readTime: string;
  featured: boolean;
};

const defaultPreview: PreviewData = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  category: "",
  categorySlug: "",
  author: "",
  image: "",
  imageAlt: "",
  readTime: "",
  featured: false,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticlePreview({ data }: { data: PreviewData }) {
  const d = { ...defaultPreview, ...data };
  const hasImage = d.image.trim().length > 0;
  const isValidUrl =
    hasImage &&
    (d.image.startsWith("http://") || d.image.startsWith("https://") || d.image.startsWith("/"));

  return (
    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <p className="border-b border-zinc-200 px-4 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        Preview
      </p>
      <article className="p-6">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {d.category || "Category"}
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {d.title || "Article title"}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {d.author || "Author"} · {formatDate(new Date().toISOString())}
          {d.readTime ? ` · ${d.readTime} min read` : ""}
          {d.featured ? " · Featured" : ""}
        </p>

        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {hasImage && isValidUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.image}
              alt={d.imageAlt || d.title || "Article image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-zinc-400 dark:text-zinc-500">
              {hasImage ? "Invalid image URL" : "Image URL"}
            </div>
          )}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {d.excerpt || "Excerpt will appear here."}
        </p>
        {d.body ? (
          <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
            {d.body
              .split(/\n\n+/)
              .flatMap((block) => {
                const trimmed = block.trim();
                if (!trimmed) return [];
                if (trimmed.length > 300 && trimmed.includes("\n")) {
                  return trimmed.split(/\n/).map((s) => s.trim()).filter(Boolean);
                }
                return [trimmed];
              })
              .map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {paragraph}
                </p>
              ))}
          </div>
        ) : (
          <p className="mt-4 text-sm italic text-zinc-400 dark:text-zinc-500">Article body will appear here.</p>
        )}
        {d.slug && (
          <p className="mt-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">/article/{d.slug}</p>
        )}
      </article>
    </div>
  );
}
