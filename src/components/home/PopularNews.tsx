import { SectionHeading } from "./SectionHeading";
import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface PopularNewsProps {
  articles: Article[];
}

export function PopularNews({ articles }: PopularNewsProps) {
  return (
    <section aria-labelledby="popular-heading">
      <SectionHeading id="popular-heading" title="Popular News" linkHref="/popular" linkLabel="See More" />
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} size="small" showExcerpt={false} />
        ))}
      </div>
    </section>
  );
}
