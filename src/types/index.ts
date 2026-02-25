export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  image: string;
  imageAlt?: string;
  featured?: boolean;
  readTime?: number; // minutes
  body?: string; // full article text
}

export interface Category {
  name: string;
  slug: string;
}
