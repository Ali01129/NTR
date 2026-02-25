import { SITE_NAME } from "@/lib/constants";
import { NewArticleEditor } from "./NewArticleEditor";

export const metadata = {
  title: `New Article | Admin | ${SITE_NAME}`,
  description: "Create a new article",
};

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Create new article</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Preview updates as you type. Data is saved to Supabase when configured.
      </p>
      <div className="mt-8">
        <NewArticleEditor />
      </div>
    </div>
  );
}
