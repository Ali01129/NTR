export const ALLOWED_CATEGORIES = ["Movies", "TV", "Gaming", "Tech", "Culture"] as const;
export type ArticleCategory = (typeof ALLOWED_CATEGORIES)[number];
