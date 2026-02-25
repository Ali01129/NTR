import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleBySlug } from "@/data/articles";
import { SITE_NAME } from "@/lib/constants";
import { EditArticleEditor } from "./EditArticleEditor";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Analytics card for this article */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-700">
          <h2 className="font-semibold text-zinc-900 dark:text-white">Article analytics</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Key stats for this article. Connect Google Analytics for view data.
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Title</p>
            <p className="mt-1 font-medium text-zinc-900 dark:text-white">{article.title}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Slug</p>
            <p className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">/article/{article.slug}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Published</p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{formatDate(article.publishedAt)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Category · Author</p>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{article.category} · {article.author}</p>
          </div>
        </div>
        <div className="border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
          <Link
            href={`/article/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            View on {SITE_NAME} →
          </Link>
        </div>
      </div>

      {/* Edit: preview left, form right */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">Edit article</h2>
        <EditArticleEditor article={article} />
      </div>
    </div>
  );
}
