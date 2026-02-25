"use server";

import { isAdminLoggedIn } from "@/lib/auth-admin";

const ALLOWED_CATEGORIES = ["Movies", "TV", "Gaming", "Tech", "Culture"];

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
- body: full article text with 6–8 distinct paragraphs. CRITICAL: separate each paragraph with exactly one blank line (double newline \\n\\n). Do NOT output one long paragraph. Example format: "First paragraph text.\\n\\nSecond paragraph text.\\n\\nThird paragraph text." No markdown.
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

function parseAndValidate(content: string): GeneratedArticleData | null {
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
    return {
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
  } catch {
    return null;
  }
}

async function callOpenRouter(
  model: string,
  prompt: string
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
        { role: "system", content: SYSTEM_PROMPT },
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

export async function generateArticleWithAIAction(
  prompt: string
): Promise<GenerateArticleAIState> {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    return { ok: false, error: "You must be logged in to use this feature." };
  }

  const trimmed = prompt?.trim();
  if (!trimmed) {
    return { ok: false, error: "Please enter a prompt describing the article." };
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
      const data = parseAndValidate(content);
      if (data) return { ok: true, data };
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
