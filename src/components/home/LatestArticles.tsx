import { SectionHeading } from "./SectionHeading";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface LatestArticlesProps {
  articles: Article[];
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section aria-labelledby="latest-heading">
      <SectionHeading id="latest-heading" title="Latest Articles" linkHref="/archive" linkLabel="See More" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} showExcerpt />
        ))}
      </div>
    </section>
  );
}
