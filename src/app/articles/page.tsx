import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/home/ArticleCard";
import { AdSlot } from "@/components/ads/AdSlot";
import { getAllArticles, categories } from "@/data/dummy";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Article } from "@/types";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ searchParams }: ArticlesPageProps): Promise<Metadata> {
  const { category: categorySlug } = await searchParams;
  const categoryName = categorySlug ? getCategoryName(categorySlug) : null;
  const title = categoryName ? `${categoryName} Articles` : "All Articles";
  const description = categoryName
    ? `Browse ${categoryName} articles on ${SITE_NAME}.`
    : `Browse all articles on ${SITE_NAME}. Search and explore the latest news, trends and reports.`;
  const canonical = categorySlug
    ? `${SITE_URL}/articles?category=${categorySlug}`
    : `${SITE_URL}/articles`;
  return {
    title,
    description,
    alternates: { canonical },
  };
}

const ARTICLES_PER_PAGE = 12;

function getCategoryName(slug: string): string | null {
  const cat = categories.find((c) => c.slug === slug);
  return cat ? cat.name : null;
}

function filterBySearch(articles: Article[], query: string): Article[] {
  if (!query.trim()) return articles;
  const q = query.trim().toLowerCase();
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
  );
}

function filterByCategory(articles: Article[], categorySlug: string): Article[] {
  if (!categorySlug.trim()) return articles;
  const slug = categorySlug.trim().toLowerCase();
  return articles.filter((a) => a.categorySlug.toLowerCase() === slug);
}

function buildSearchParams(
  q: string | undefined,
  category: string | undefined,
  page: number
): string {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (page > 1) params.set("page", String(page));
  const s = params.toString();
  return s ? `?${s}` : "";
}

interface ArticlesPageProps {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const { q: query = "", page: pageParam = "1", category: categorySlug = "" } = await searchParams;
  const page = Math.max(1, parseInt(pageParam, 10) || 1);
  const categoryName = categorySlug ? getCategoryName(categorySlug) : null;

  const all = getAllArticles();
  const byCategory = filterByCategory(all, categorySlug);
  const filtered = filterBySearch(byCategory, query);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ARTICLES_PER_PAGE;
  const articles = filtered.slice(start, start + ARTICLES_PER_PAGE);

  const prevParams = currentPage > 1 ? buildSearchParams(query, categorySlug || undefined, currentPage - 1) : null;
  const nextParams = currentPage < totalPages ? buildSearchParams(query, categorySlug || undefined, currentPage + 1) : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" id="main-content" role="main">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {categoryName ?? "All Articles"}
          </h1>

          <form
            method="get"
            action="/articles"
            className="mt-6"
            role="search"
            aria-label="Search articles"
          >
            <input type="hidden" name="page" value="1" />
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            <div className="flex gap-2">
              <label htmlFor="articles-search" className="sr-only">
                Search articles
              </label>
              <input
                id="articles-search"
                type="search"
                name="q"
                defaultValue={query}
                placeholder={categoryName ? `Search in ${categoryName}...` : "Search by title, author, category..."}
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-400 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
                aria-label="Search articles"
              />
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-8">
            <AdSlot slotId="articles-banner-1" size="banner" label="Advertisement" />
          </div>

          <section className="mt-10" aria-label="Articles list">
            {(query || categoryName) && (
              <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
                {filtered.length === 0
                  ? categoryName
                    ? `No ${categoryName} articles${query ? " match your search." : "."}`
                    : "No articles match your search."
                  : `${filtered.length} ${categoryName ? categoryName + " " : ""}article${filtered.length === 1 ? "" : "s"} found.`}
              </p>
            )}
            {articles.length === 0 ? (
              <p className="py-12 text-center text-zinc-600 dark:text-zinc-400">
                No articles to show.
              </p>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} showExcerpt />
                  ))}
                </div>

                <div className="mt-10">
                  <AdSlot slotId="articles-banner-2" size="banner" label="Advertisement" />
                </div>

                {totalPages > 1 && (
                  <nav
                    className="mt-10 flex w-full items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800"
                    aria-label="Pagination"
                  >
                    <div className="min-w-[6rem] flex-1 text-left">
                      {currentPage > 1 ? (
                        <Link
                          href={`/articles${prevParams ?? ""}`}
                          className="rounded px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          ← Previous
                        </Link>
                      ) : (
                        <span className="rounded px-3 py-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                          ← Previous
                        </span>
                      )}
                    </div>
                    <span className="flex-shrink-0 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <div className="min-w-[6rem] flex-1 text-right">
                      {currentPage < totalPages ? (
                        <Link
                          href={`/articles${nextParams ?? ""}`}
                          className="rounded px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                        >
                          Next →
                        </Link>
                      ) : (
                        <span className="rounded px-3 py-1.5 text-sm text-zinc-400 dark:text-zinc-500">
                          Next →
                        </span>
                      )}
                    </div>
                  </nav>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
