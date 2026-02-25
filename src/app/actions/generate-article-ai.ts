"use server";

import { isAdminLoggedIn } from "@/lib/auth-admin";
import { ALLOWED_CATEGORIES } from "@/lib/article-categories";

const AUTHOR_NAME = "ntr";

export type GeneratedArticleData = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  categorySlug: string;
  author: string;
  image: string;
  imageAlt: string;
  readTime: string;
};

export type GenerateArticleAIState =
  | { ok: true; data: GeneratedArticleData }
  | { ok: false; error: string };

const SYSTEM_PROMPT = `You are an assistant that generates article metadata and full article content. Given a user prompt describing what article they want, respond with ONLY a valid JSON object—no markdown code fences, no explanation, no other text. Use these exact keys (all strings unless noted):
- slug: URL-friendly slug (lowercase, hyphens, e.g. "my-article-title")
- title: article title
- excerpt: short summary (1-3 sentences)
- body: full article text with 6–8 distinct paragraphs AND 2–4 section headings. CRITICAL: Put each heading on its own line starting with ## followed by a space (e.g. "## Key Takeaways" or "## The Verdict"). Separate paragraphs and heading lines with exactly one blank line (double newline \\n\\n). Include headings to structure the article (e.g. after intro, before key sections). Example: "First paragraph.\\n\\n## Main Points\\n\\nSecond paragraph.\\n\\n## Conclusion\\n\\nFinal paragraph." No other markdown.
- category: must be exactly one of: Movies, TV, Gaming, Tech, Culture
- imageKeywords: 2-4 comma-separated English keywords that describe a photo that would fit this article (e.g. "sci-fi movie, cinema, space" or "gaming, controller, screen"). Used to fetch a topic-related image. No spaces after commas.
- imageAlt: short description of the image for accessibility (what the image shows)
- readTime: estimated read time in minutes as a string number (e.g. "5")`;

function getModels(): string[] {
  const raw = process.env.OPENROUTER_MODELS;
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
}

function normalizeCategory(category: string): string {
  const c = category.trim();
  const match = ALLOWED_CATEGORIES.find(
    (a) => a.toLowerCase() === c.toLowerCase()
  );
  return match ?? ALLOWED_CATEGORIES[0];
}

/** Fetch first image URL from Pixabay for a search term. */
async function fetchPixabayImage(
  apiKey: string,
  q: string
): Promise<string | null> {
  const query = q.replace(/\s*,\s*/g, " ").trim().slice(0, 100);
  if (!query) return null;
  const url = `https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}&per_page=3`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      hits?: Array<{ largeImageURL?: string; webformatURL?: string }>;
    };
    const first = data.hits?.[0];
    return first?.largeImageURL ?? first?.webformatURL ?? null;
  } catch {
    return null;
  }
}

function parseAndValidate(
  content: string
): { data: GeneratedArticleData; imageSearchQuery: string } | null {
  try {
    let json = content.trim();
    const codeBlock = json.match(/^```(?:json)?\s*([\s\S]*?)```$/);
    if (codeBlock) json = codeBlock[1].trim();
    const obj = JSON.parse(json) as Record<string, unknown>;
    const slug = typeof obj.slug === "string" ? obj.slug : "";
    const title = typeof obj.title === "string" ? obj.title : "";
    const excerpt = typeof obj.excerpt === "string" ? obj.excerpt : "";
    const body = typeof obj.body === "string" ? obj.body : "";
    const category = normalizeCategory(
      typeof obj.category === "string" ? obj.category : ""
    );
    const rawKeywords =
      typeof obj.imageKeywords === "string" ? obj.imageKeywords.trim() : "";
    const tagSegment = rawKeywords
      .replace(/\s*,\s*/g, ",")
      .replace(/\s+/g, "-");
    const image =
      tagSegment !== ""
        ? `https://loremflickr.com/800/450/${tagSegment}`
        : "https://picsum.photos/800/450";
    const imageAlt =
      typeof obj.imageAlt === "string" ? obj.imageAlt : "Article image";
    const readTime =
      typeof obj.readTime === "number"
        ? String(obj.readTime)
        : typeof obj.readTime === "string"
          ? obj.readTime
          : "5";
    if (!slug || !title || !body) return null;
    const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
    const data: GeneratedArticleData = {
      slug: slug.replace(/\s+/g, "-").toLowerCase(),
      title,
      excerpt: excerpt || title,
      body,
      category,
      categorySlug,
      author: AUTHOR_NAME,
      image,
      imageAlt,
      readTime,
    };
    return { data, imageSearchQuery: rawKeywords };
  } catch {
    return null;
  }
}

async function callOpenRouter(
  model: string,
  prompt: string,
  systemPrompt?: string
): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt ?? SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 5120,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`OpenRouter [${model}] error:`, res.status, err);
    return null;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  return typeof text === "string" ? text : null;
}

/** Internal: generate article content from a prompt (no auth). Used by API/cron. */
export async function generateArticleFromPromptInternal(
  prompt: string
): Promise<GenerateArticleAIState> {
  const trimmed = prompt?.trim();
  if (!trimmed) {
    return { ok: false, error: "Empty prompt." };
  }

  const models = getModels();
  if (models.length === 0) {
    return {
      ok: false,
      error:
        "No OpenRouter models configured. Set OPENROUTER_MODELS in your environment (e.g. openai/gpt-4o-mini,anthropic/claude-3-haiku).",
    };
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      ok: false,
      error: "OpenRouter API key is not set (OPENROUTER_API_KEY).",
    };
  }

  let lastError: string | null = null;
  for (const model of models) {
    const content = await callOpenRouter(model, trimmed);
    if (content) {
      const parsed = parseAndValidate(content);
      if (parsed) {
        const { data, imageSearchQuery } = parsed;
        const pixabayKey = process.env.PIXABAY_API_KEY?.trim();
        if (pixabayKey && imageSearchQuery) {
          const pixabayUrl = await fetchPixabayImage(pixabayKey, imageSearchQuery);
          if (pixabayUrl) data.image = pixabayUrl;
        }
        return { ok: true, data };
      }
      lastError = "Model returned invalid or incomplete JSON.";
    } else {
      lastError = `Model ${model} failed or returned no content.`;
    }
  }

  return {
    ok: false,
    error: lastError ?? "All models failed. Try again or check your API key and OPENROUTER_MODELS.",
  };
}

export async function generateArticleWithAIAction(
  prompt: string
): Promise<GenerateArticleAIState> {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    return { ok: false, error: "You must be logged in to use this feature." };
  }
  return generateArticleFromPromptInternal(prompt);
}

/** Fetch one trending topic per category from AI (for API/cron). */
const TRENDING_TOPICS_SYSTEM = `You are an assistant that suggests current, trending topics for short articles. Respond with ONLY a valid JSON object—no markdown, no explanation. Use exactly these keys (each value is a string, one specific topic to write about):
- Movies: one trending movie-related topic (e.g. a new release, a controversy, a milestone)
- TV: one trending TV topic (show, streaming, industry)
- Gaming: one trending gaming topic (game, platform, esports)
- Tech: one trending tech topic (product, company, trend)
- Culture: one trending culture topic (internet, social, viral)
Topics should be current and specific enough to write a single engaging article. Vary them each time; do not repeat the same suggestions.`;

export async function getTrendingTopicsFromAI(): Promise<
  { [K in (typeof ALLOWED_CATEGORIES)[number]]: string } | null
> {
  const models = getModels();
  if (models.length === 0 || !process.env.OPENROUTER_API_KEY) return null;

  const userPrompt =
    "Give me one trending topic for each category right now. Return only the JSON object.";

  for (const model of models) {
    const content = await callOpenRouter(model, userPrompt, TRENDING_TOPICS_SYSTEM);
    if (!content) continue;
    try {
      let json = content.trim();
      const codeBlock = json.match(/^```(?:json)?\s*([\s\S]*?)```$/);
      if (codeBlock) json = codeBlock[1].trim();
      const obj = JSON.parse(json) as Record<string, unknown>;
      const out: Record<string, string> = {};
      for (const cat of ALLOWED_CATEGORIES) {
        const v = obj[cat];
        if (typeof v === "string" && v.trim()) out[cat] = v.trim();
      }
      if (Object.keys(out).length === ALLOWED_CATEGORIES.length) {
        return out as { [K in (typeof ALLOWED_CATEGORIES)[number]]: string };
      }
    } catch {
      // try next model
    }
  }
  return null;
}
