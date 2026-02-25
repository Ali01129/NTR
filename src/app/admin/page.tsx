import Link from "next/link";
import { getAllArticles } from "@/data/articles";
import { SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Admin Dashboard",
  description: "Site management",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <h2 className="font-semibold text-zinc-900 dark:text-white">All articles</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Click an article to view analytics and edit.</p>
        </div>
        <div className="max-h-[28rem] overflow-auto">
          {articles.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500 dark:text-zinc-400">No articles yet.</p>
          ) : (
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {articles.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <Link
                    href={`/admin/article/${a.slug}`}
                    className="font-medium text-zinc-900 hover:underline dark:text-white"
                  >
                    {a.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {a.category} · {formatDate(a.publishedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Add Google Analytics to your site for page views and traffic data.
      </p>
    </div>
  );
}
