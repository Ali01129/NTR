import { SITE_URL } from "@/lib/constants";
import { featuredArticles, latestArticles, popularArticles } from "@/data/dummy";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleSlugs = [
    ...featuredArticles,
    ...latestArticles,
    ...popularArticles,
  ].map((a) => a.slug);

  const articleUrls = articleSlugs.map((slug) => ({
    url: `${SITE_URL}/article/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/category/movies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/gaming`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/tech`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/category/culture`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...articleUrls,
  ];
}
