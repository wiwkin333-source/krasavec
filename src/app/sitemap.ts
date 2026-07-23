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
 *   when the content actually might change.
 *
 * Image sitemap (Google Images / Яндекс.Картинки):
 *   Next.js 16's sitemap serializer only supports string URLs in the
 *   `images` array — objects with {url, title, caption} get rendered as
 *   "[object Object]" in <image:loc>, breaking the XML. So we use
 *   plain absolute URL strings here. Google/Yandex will still register
 *   the images in image search; the title/caption come from the page's
 *   own <meta> and alt attributes at crawl time.
 *
 * Submit this sitemap in:
 *   - Yandex.Webmaster: https://webmaster.yandex.ru/site/https:gravikot.ru/
 *   - Google Search Console: https://search.google.com/search-console
 */

const BASE_URL = "https://gravikot.ru";
const BUILD_TIME = new Date();

/** Convert a possibly-relative image path to an absolute URL. */
function absImg(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

// Force fresh generation on every request — never serve stale cached version.
// Without this, CDN or Next.js ISR may cache an old sitemap for days/weeks.
export const revalidate = 0;

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 1.0,
      images: [`${BASE_URL}/assets/gravikot-poster.webp`],
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.9,
      images: categories
        .map((c) => c.products[0]?.src)
        .filter(Boolean)
        .map((src) => absImg(src)!),
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/delivery`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.5,
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

  // Category pages — register all product primary images so each
  // collection has its full visual footprint in image search.
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}${categoryUrl(cat)}`,
    lastModified: BUILD_TIME,
    changeFrequency: "weekly",
    priority: 0.8,
    images: cat.products
      .map((p) => p.src)
      .filter(Boolean)
      .map((src) => absImg(src)!),
  }));

  // Product pages — register ALL images (primary + gallery) so each
  // individual photo can rank in image search and link back to the
  // product page.
  const productPages: MetadataRoute.Sitemap = categories.flatMap((cat) =>
    cat.products.map((prod) => {
      const allImages = [prod.src, ...(prod.gallery ?? [])].filter(
        Boolean,
      ) as string[];
      return {
        url: `${BASE_URL}${productUrl(cat, prod)}`,
        lastModified: BUILD_TIME,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: allImages.map((src) => absImg(src)!),
      };
    }),
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
