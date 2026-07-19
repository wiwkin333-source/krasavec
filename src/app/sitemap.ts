import { MetadataRoute } from "next";
import { categories, categoryUrl, productUrl } from "@/lib/catalog-data";

/**
 * Auto-generated sitemap.xml — served at /sitemap.xml by Next.js.
 *
 * URLs are derived directly from the catalog data (src/lib/catalog-data.ts),
 * so the sitemap is always in sync with the live site — no stale links,
 * no 404s. When a product is removed from the catalog, it disappears from
 * the sitemap on the next build/deploy.
 *
 * lastModified strategy:
 *   We use a single BUILD_TIME timestamp (captured once at module load)
 *   instead of `new Date()` per request. Calling `new Date()` on every
 *   request would make every URL appear "changed today" to crawlers,
 *   which wastes crawl budget and can look spammy. With BUILD_TIME, the
 *   timestamp only advances on a new build/deploy — which is exactly
 *   when the content actually might have changed.
 *
 * Submit this sitemap in:
 *   - Yandex.Webmaster: https://webmaster.yandex.ru/site/https:gravikot.ru/
 *   - Google Search Console: https://search.google.com/search-console
 */

const BASE_URL = "https://gravikot.ru";
const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: BUILD_TIME,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: BUILD_TIME,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}${categoryUrl(cat)}`,
    lastModified: BUILD_TIME,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    cat.products.map((prod) => ({
      url: `${BASE_URL}${productUrl(cat, prod)}`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.7,
    })),
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
