import type { Article, Category } from "@/types";

/** All unique articles from every section, sorted by publishedAt descending */
export function getAllArticles(): Article[] {
  const byId = new Map<string, Article>();
  const add = (a: Article) => byId.set(a.id, a);
  featuredArticles.forEach(add);
  popularArticles.forEach(add);
  topicSection.articles.forEach(add);
  latestArticles.forEach(add);
  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/** Get a single article by slug, or null if not found */
export function getArticleBySlug(slug: string): Article | null {
  const all = getAllArticles();
  const normalized = slug.trim().toLowerCase();
  return all.find((a) => a.slug.toLowerCase() === normalized) ?? null;
}

/** Get articles in the same category, optionally excluding one by id and limiting count */
export function getArticlesByCategory(
  categorySlug: string,
  options?: { excludeId?: string; limit?: number }
): Article[] {
  const all = getAllArticles();
  const slug = categorySlug.trim().toLowerCase();
  const excludeId = options?.excludeId;
  const limit = options?.limit ?? 6;
  return all
    .filter((a) => a.categorySlug.toLowerCase() === slug && a.id !== excludeId)
    .slice(0, limit);
}

export const categories: Category[] = [
  { name: "Movies", slug: "movies" },
  { name: "TV", slug: "tv" },
  { name: "Gaming", slug: "gaming" },
  { name: "Tech", slug: "tech" },
  { name: "Culture", slug: "culture" },
];

export const featuredArticles: Article[] = [
  {
    id: "1",
    slug: "new-series-premiere-review",
    title: "The New Series Everyone's Binging Just Dropped Its Finale",
    excerpt: "We break down the finale and what it means for season two.",
    category: "TV",
    categorySlug: "tv",
    author: "Jordan Lee",
    publishedAt: "2026-02-25T08:00:00Z",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80",
    readTime: 4,
  },
  {
    id: "2",
    slug: "streaming-wars-whats-next",
    title: "Streaming Wars: What's Next for Your Favorite Platforms",
    excerpt: "Major shifts are coming to how we watch. A deep dive into the future of streaming.",
    category: "TV",
    categorySlug: "tv",
    author: "Jordan Lee",
    publishedAt: "2026-02-24T14:30:00Z",
    image: "https://images.unsplash.com/photo-1574375927938-c5a448332a3e?w=800&q=80",
    imageAlt: "Streaming on TV",
    featured: true,
    readTime: 6,
  },
  {
    id: "3",
    slug: "indie-game-of-the-year-contenders",
    title: "Indie Game of the Year: Early Contenders for 2026",
    excerpt: "Small studios are delivering big experiences. These titles are already turning heads.",
    category: "Gaming",
    categorySlug: "gaming",
    author: "Sam Chen",
    publishedAt: "2026-02-23T09:15:00Z",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80",
    imageAlt: "Gaming setup",
    featured: true,
    readTime: 7,
  },
  {
    id: "4",
    slug: "ai-in-creative-industries",
    title: "How AI Is Reshaping the Creative Industries",
    excerpt: "From scriptwriting to visual effects, artificial intelligence is everywhere in entertainment.",
    category: "Tech",
    categorySlug: "tech",
    author: "Morgan Blake",
    publishedAt: "2026-02-22T16:00:00Z",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    imageAlt: "AI and creativity",
    featured: true,
    readTime: 10,
  },
  {
    id: "5",
    slug: "cultural-moments-that-defined-february",
    title: "The Cultural Moments That Defined February 2026",
    excerpt: "A look back at the events, releases, and trends that had everyone talking.",
    category: "Culture",
    categorySlug: "culture",
    author: "Riley Park",
    publishedAt: "2026-02-21T11:45:00Z",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    imageAlt: "Concert crowd",
    featured: true,
    readTime: 5,
  },
];

export const popularArticles: Article[] = [
  {
    id: "6",
    slug: "new-series-premiere-review",
    title: "The New Series Everyone's Binging Just Dropped Its Finale",
    excerpt: "We break down the finale and what it means for season two.",
    category: "TV",
    categorySlug: "tv",
    author: "Jordan Lee",
    publishedAt: "2026-02-25T08:00:00Z",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80",
    readTime: 4,
  },
  {
    id: "7",
    slug: "retro-gaming-comeback",
    title: "Why Retro Gaming Is Bigger Than Ever in 2026",
    excerpt: "Nostalgia meets modern convenience in the resurgence of classic games.",
    category: "Gaming",
    categorySlug: "gaming",
    author: "Sam Chen",
    publishedAt: "2026-02-24T12:00:00Z",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    readTime: 6,
  },
  {
    id: "8",
    slug: "documentary-filmmaking-today",
    title: "Documentary Filmmaking in the Age of Streaming",
    excerpt: "How platforms are changing the way we tell true stories.",
    category: "Movies",
    categorySlug: "movies",
    author: "Alex Rivera",
    publishedAt: "2026-02-23T15:30:00Z",
    image: "https://images.unsplash.com/photo-1440404653323-ab43d7dd2f2a?w=400&q=80",
    readTime: 7,
  },
  {
    id: "9",
    slug: "podcasts-that-shaped-culture",
    title: "The Podcasts That Shaped Pop Culture This Year",
    excerpt: "From true crime to comedy, these shows had the biggest impact.",
    category: "Culture",
    categorySlug: "culture",
    author: "Riley Park",
    publishedAt: "2026-02-22T09:00:00Z",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&q=80",
    readTime: 5,
  },
];

export const topicSection = {
  title: "Deep Dives",
  subtitle: "Explore in-depth features and long reads.",
  linkLabel: "See More",
  linkHref: "/articles",
  articles: [
    {
      id: "10",
      slug: "behind-the-scenes-mega-franchise",
      title: "Behind the Scenes of the Year's Biggest Franchise",
      excerpt: "An exclusive look at how the team brought this universe to life.",
      category: "Movies",
      categorySlug: "movies",
      author: "Alex Rivera",
      publishedAt: "2026-02-20T10:00:00Z",
      image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=600&q=80",
      readTime: 12,
    },
    {
      id: "11",
      slug: "ten-best-shows-decade",
      title: "The 10 Best Shows of the Decade (So Far), Ranked",
      excerpt: "A definitive ranking of the series that defined the 2020s.",
      category: "TV",
      categorySlug: "tv",
      author: "Jordan Lee",
      publishedAt: "2026-02-19T14:00:00Z",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
      readTime: 15,
    },
    {
      id: "12",
      slug: "indie-games-you-missed",
      title: "10 Indie Games You Might Have Missed (And Why You Should Play Them)",
      excerpt: "Hidden gems that deserve a spot on your playlist.",
      category: "Gaming",
      categorySlug: "gaming",
      author: "Sam Chen",
      publishedAt: "2026-02-18T11:00:00Z",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
      readTime: 8,
    },
  ],
};

export const latestArticles: Article[] = [
  {
    id: "13",
    slug: "marvel-phase-six-rumors",
    title: "Marvel Phase Six: Every Rumor and Confirmed Project So Far",
    excerpt: "The next chapter of the MCU is taking shape. Here's what we know.",
    category: "Movies",
    categorySlug: "movies",
    author: "Alex Rivera",
    publishedAt: "2026-02-25T07:00:00Z",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80",
    readTime: 6,
  },
  {
    id: "14",
    slug: "hbo-max-originals-2026",
    title: "HBO Max Originals 2026: Full Slate Revealed",
    excerpt: "From returning favorites to bold new series, the lineup is stacked.",
    category: "TV",
    categorySlug: "tv",
    author: "Jordan Lee",
    publishedAt: "2026-02-25T06:30:00Z",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400&q=80",
    readTime: 5,
  },
  {
    id: "15",
    slug: "nintendo-next-console-leaks",
    title: "Nintendo's Next Console: Latest Leaks and What to Expect",
    excerpt: "Rumors are heating up. We analyze every leak and report.",
    category: "Gaming",
    categorySlug: "gaming",
    author: "Sam Chen",
    publishedAt: "2026-02-24T22:00:00Z",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80",
    readTime: 7,
  },
  {
    id: "16",
    slug: "privacy-tools-2026",
    title: "Best Privacy Tools for 2026: A Practical Guide",
    excerpt: "Protect your data with these recommended apps and services.",
    category: "Tech",
    categorySlug: "tech",
    author: "Morgan Blake",
    publishedAt: "2026-02-24T18:00:00Z",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&q=80",
    readTime: 9,
  },
  {
    id: "17",
    slug: "festival-season-preview",
    title: "Festival Season 2026: What to Watch and Where",
    excerpt: "A guide to the biggest film and music festivals around the world.",
    category: "Culture",
    categorySlug: "culture",
    author: "Riley Park",
    publishedAt: "2026-02-24T14:00:00Z",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
    readTime: 6,
  },
  {
    id: "18",
    slug: "sci-fi-books-adaptations",
    title: "Sci-Fi Books Getting the Adaptation Treatment in 2026",
    excerpt: "Your favorite novels are heading to screen. Here's the list.",
    category: "Movies",
    categorySlug: "movies",
    author: "Alex Rivera",
    publishedAt: "2026-02-24T10:00:00Z",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    readTime: 4,
  },
];
