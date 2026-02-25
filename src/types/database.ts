/** Supabase table row for articles (snake_case as in DB) */
export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  category_slug: string;
  author: string;
  published_at: string;
  image: string;
  image_alt: string | null;
  featured: boolean | null;
  read_time: number | null;
  body: string | null;
  created_at?: string;
  updated_at?: string;
}
