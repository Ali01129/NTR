import { ArticleCard } from "./ArticleCard";
import type { Article } from "@/types";

interface HeroFeaturedProps {
  articles: Article[];
}

export function HeroFeatured({ articles }: HeroFeaturedProps) {
  const lead = articles[0];

  return (
    <section aria-label="Featured stories">
      {lead && <ArticleCard article={lead} size="large" showExcerpt />}
    </section>
  );
}
