import Link from "next/link";
import { SectionHeading } from "./SectionHeading";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface TopicSectionProps {
  title: string;
  subtitle?: string;
  linkLabel: string;
  linkHref: string;
  articles: Article[];
}

export function TopicSection({ title, subtitle, linkLabel, linkHref, articles }: TopicSectionProps) {
  return (
    <section aria-labelledby="topic-heading">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="topic-heading" className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
        <Link
          href={linkHref}
          className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {linkLabel} →
        </Link>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} showExcerpt />
        ))}
      </div>
    </section>
  );
}
