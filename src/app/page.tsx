import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroFeatured } from "@/components/home/HeroFeatured";
import { PopularNews } from "@/components/home/PopularNews";
import { TopicSection } from "@/components/home/TopicSection";
import { LatestArticles } from "@/components/home/LatestArticles";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdSlotRow } from "@/components/ads/AdSlotRow";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  featuredArticles,
  popularArticles,
  topicSection,
  latestArticles,
} from "@/data/dummy";
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_URL,
  SITE_IMAGE,
} from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "articles",
    "news",
    "stories",
    "culture",
    "movies",
    "TV",
    "gaming",
    "tech",
    "entertainment",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} – ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [SITE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    // Uncomment and set when you have verification codes:
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

function getHomePageJsonLd() {
  const articleListItems = featuredArticles
    .slice(0, 5)
    .map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/article/${article.slug}`,
      name: article.title,
    }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: `${SITE_NAME} – ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
      },
      {
        "@type": "ItemList",
        itemListElement: articleListItems,
      },
    ],
  };
}

export default function Home() {
  const jsonLd = getHomePageJsonLd();

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1" id="main-content" role="main">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
            <h1 className="sr-only">
              {SITE_NAME} – {SITE_TAGLINE}
            </h1>

            <HeroFeatured articles={featuredArticles} />

            <div className="mt-12 lg:mt-16">
              <AdSlotRow baseSlotId="home-box" label="Advertisement" />
            </div>

            <div className="mt-12 lg:mt-16">
              <PopularNews articles={popularArticles} />
            </div>
            <div className="mt-12 lg:mt-16">
              <TopicSection
                title={topicSection.title}
                subtitle={topicSection.subtitle}
                linkLabel={topicSection.linkLabel}
                linkHref={topicSection.linkHref}
                articles={topicSection.articles}
              />
            </div>
            <div className="mt-12 lg:mt-16">
              <AdSlot
                slotId="home-banner-2"
                size="banner"
                label="Advertisement"
              />
            </div>
            <div className="mt-12 lg:mt-16">
              <LatestArticles articles={latestArticles} />
            </div>
            <div className="mt-12 lg:mt-16">
              <AdSlot
              slotId="home-banner-1"
              size="banner"
              label="Advertisement"
            />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
