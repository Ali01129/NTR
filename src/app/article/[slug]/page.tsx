import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { getArticleBySlug, getArticlesByCategory } from "@/data/articles";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  const url = `${SITE_URL}/article/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author],
      images: article.image ? [{ url: article.image, alt: article.imageAlt ?? article.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const recommendations = await getArticlesByCategory(article.categorySlug, {
    excludeId: article.id,
    limit: 3,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content" role="main">
        <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <header className="mb-8">
            <Link
              href={`/articles?category=${article.categorySlug}`}
              className="text-xs font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            >
              {article.category}
            </Link>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {article.title}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{article.author}</span>
              <span>{formatDate(article.publishedAt)}</span>
              {article.readTime != null && (
                <span>{article.readTime} min read</span>
              )}
            </p>
          </header>

          <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={article.imageAlt ?? article.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
              {article.excerpt}
            </p>
            {article.body && (
              <div className="mt-6 space-y-4 text-zinc-700 dark:text-zinc-300">
                {article.body
                  .split(/\n\n+/)
                  .flatMap((block) => {
                    const trimmed = block.trim();
                    if (!trimmed) return [];
                    // If one long block with single newlines, split on \n (AI may use single newlines between paragraphs)
                    if (trimmed.length > 300 && trimmed.includes("\n")) {
                      return trimmed
                        .split(/\n/)
                        .map((s) => s.trim())
                        .filter(Boolean);
                    }
                    return [trimmed];
                  })
                  .map((block, i) =>
                    block.startsWith("## ") ? (
                      <h2
                        key={i}
                        className="mt-6 text-xl font-bold text-zinc-900 dark:text-white first:mt-0"
                      >
                        {block.replace(/^##\s*/, "").trim()}
                      </h2>
                    ) : (
                      <p key={i} className="leading-relaxed">
                        {block}
                      </p>
                    )
                  )}
              </div>
            )}
          </div>

          <section
            className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800"
            aria-labelledby="recommendations-heading"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2
                id="recommendations-heading"
                className="text-xl font-semibold text-zinc-900 dark:text-white"
              >
                More in {article.category}
              </h2>
              <Link
                href={`/articles?category=${article.categorySlug}`}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
              >
                View all in {article.category}
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {recommendations.map((recommended) => (
                <ArticleCard
                  key={recommended.id}
                  article={recommended}
                  showExcerpt
                />
              ))}
            </div>
            {recommendations.length === 0 && (
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                No other articles in this category right now.
              </p>
            )}
          </section>

          <footer className="mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to {SITE_NAME} articles
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </div>
  );
}
