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
 *   Each catalog URL also carries an `images` array listing the product
 *   photos associated with that page. This registers them with image
 *   search — additional traffic from Yandex.Images and Google Images.
 *   Image URLs are absolute (https://gravikot.ru/...).
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

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 1.0,
      // Register the hero poster image with image search.
      images: [
        {
          url: `${BASE_URL}/assets/gravikot-poster.webp`,
          title: "ГРАВИКОТ — светящаяся гравировка на стекле по фото",
          caption:
            "Кружки и бокалы со светящейся гравировкой от мастерской ГРАВИКОТ.",
        },
      ],
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.9,
      // One cover image per category — gives the catalog index image
      // search presence for the top-level collections.
      images: categories
        .map((c) => c.products[0]?.src)
        .filter(Boolean)
        .map((src, i) => ({
          url: absImg(src)!,
          title: `Коллекция ${categories[i].title} — ГРАВИКОТ`,
          caption: `Светящаяся гравировка на стекле, коллекция ${categories[i].title}`,
        })),
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

  // Category pages — register the category cover image + all product
  // primary images so each collection has its full visual footprint in
  // image search.
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}${categoryUrl(cat)}`,
    lastModified: BUILD_TIME,
    changeFrequency: "weekly",
    priority: 0.8,
    images: cat.products
      .map((p) => p.src)
      .filter(Boolean)
      .map((src, i) => ({
        url: absImg(src)!,
        title: `${cat.products[i].name} — коллекция ${cat.title}, фото 1`,
        caption: `${cat.products[i].name}. ${cat.products[i].desc} Светящаяся гравировка на стекле ГРАВИКОТ, ${cat.products[i].price}`,
      })),
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
        images: allImages.map((src, i) => ({
          url: absImg(src)!,
          title: `${prod.name} — фото ${i + 1} светящаяся гравировка ГРАВИКОТ`,
          caption: `${prod.name}. ${prod.desc} Коллекция ${cat.title}. Цена: ${prod.price}.`,
        })),
      };
    }),
  );

  return [...staticPages, ...categoryPages, ...productPages];
}
