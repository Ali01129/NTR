import Link from "next/link";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  size?: "default" | "large" | "small";
  showExcerpt?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ArticleCard({ article, size = "default", showExcerpt = true }: ArticleCardProps) {
  const isLarge = size === "large";
  const isSmall = size === "small";

  return (
    <article className="group">
      <Link href={`/article/${article.slug}`} className="block">
        <div
          className={`relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 ${
            isLarge ? "aspect-[16/10]" : isSmall ? "aspect-video" : "aspect-video"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image}
            alt={article.imageAlt ?? article.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {article.readTime && (
            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
              {article.readTime} min read
            </span>
          )}
        </div>
        <div className="mt-3">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {article.category}
          </span>
          <h3
            className={`mt-1 font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-white dark:group-hover:text-zinc-300 ${
              isLarge ? "text-xl sm:text-2xl" : isSmall ? "text-sm" : "text-base sm:text-lg"
            }`}
          >
            {article.title}
          </h3>
          {showExcerpt && article.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {article.excerpt}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {article.author} · {formatDate(article.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
