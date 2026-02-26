import Link from "next/link";
import { ArticleCard } from "@/components/home/ArticleCard";
import { getAllArticles } from "@/data/articles";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Admin Dashboard",
  description: "Site management",
};

export default async function AdminDashboardPage() {
  const articles = await getAllArticles();

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage {SITE_NAME}. View analytics in Google Analytics when you add it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total articles</p>
          <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-white">{articles.length}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quick action</p>
          <Link
            href="/admin/new-article"
            className="mt-2 inline-block rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            New article
          </Link>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-zinc-900 dark:text-white">All articles</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Click an article to view analytics and edit.</p>
        {articles.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">No articles yet.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                showExcerpt
                href={`/admin/article/${article.slug}`}
              />
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Add Google Analytics to your site for page views and traffic data.
      </p>
    </div>
  );
}
