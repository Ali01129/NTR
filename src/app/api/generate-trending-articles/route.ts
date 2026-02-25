import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTrendingTopicsFromAI, generateArticleFromPromptInternal } from "@/app/actions/generate-article-ai";
import { ALLOWED_CATEGORIES } from "@/lib/article-categories";
import { createArticle } from "@/data/articles";

async function runGenerateTrendingArticles() {
  const topics = await getTrendingTopicsFromAI();
  if (!topics) {
    return NextResponse.json(
      { error: "Failed to fetch trending topics from AI. Check OPENROUTER_API_KEY and OPENROUTER_MODELS." },
      { status: 502 }
    );
  }

  const results: { category: string; slug?: string; error?: string }[] = [];

  for (const category of ALLOWED_CATEGORIES) {
    const topic = topics[category];
    if (!topic) {
      results.push({ category, error: "Missing topic" });
      continue;
    }

    const prompt = `Write a short, engaging article about: ${topic}. Category is ${category}. Use a casual, readable tone. Include 6–8 paragraphs and 2–4 section headings (## Heading). Make it timely and interesting.`;

    const generated = await generateArticleFromPromptInternal(prompt);
    if (!generated.ok) {
      results.push({ category, error: generated.error });
      continue;
    }

    const { data } = generated;
    let slug = data.slug;
    let createResult = await createArticle({
      slug,
      title: data.title,
      excerpt: data.excerpt,
      category: data.category,
      categorySlug: data.categorySlug,
      author: data.author,
      image: data.image,
      imageAlt: data.imageAlt,
      featured: false,
      readTime: data.readTime ? parseInt(data.readTime, 10) : undefined,
      body: data.body,
    });

    if (!createResult.ok && createResult.error?.toLowerCase().includes("unique") && createResult.error?.toLowerCase().includes("slug")) {
      slug = `${data.slug}-${Date.now().toString(36)}`;
      createResult = await createArticle({
        slug,
        title: data.title,
        excerpt: data.excerpt,
        category: data.category,
        categorySlug: data.categorySlug,
        author: data.author,
        image: data.image,
        imageAlt: data.imageAlt,
        featured: false,
        readTime: data.readTime ? parseInt(data.readTime, 10) : undefined,
        body: data.body,
      });
    }

    if (!createResult.ok) {
      results.push({ category, error: createResult.error });
      continue;
    }

    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/article/${createResult.article.slug}`);
    revalidatePath("/sitemap.xml");

    results.push({ category, slug: createResult.article.slug });
  }

  const created = results.filter((r) => r.slug);
  const failed = results.filter((r) => r.error);

  return NextResponse.json({
    ok: failed.length === 0,
    created: created.length,
    articles: results,
    message:
      failed.length === 0
        ? `Created ${created.length} articles.`
        : `Created ${created.length} articles; ${failed.length} failed.`,
  });
}

export async function GET() {
  return runGenerateTrendingArticles();
}

export async function POST() {
  return runGenerateTrendingArticles();
}
