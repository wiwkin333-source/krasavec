import { categories, categoryUrl, productUrl } from "@/lib/catalog-data";

/**
 * Dynamic sitemap.xml Route Handler — served at /sitemap.xml.
 *
 * WHY a Route Handler instead of the metadata-route sitemap.ts?
 *   Next.js pre-renders metadata-route sitemap.ts at build time
 *   (even with `export const dynamic = "force-dynamic"`), which means
 *   the sitemap was frozen at build time with only the pages that
 *   existed then.  On Amvera's Docker deployment the pre-rendered file
 *   persisted across re-deploys and we kept getting a stale 3-URL
 *   sitemap.
 *
 *   A Route Handler (this file) is NEVER pre-rendered — it executes
 *   on every request, so the sitemap always reflects the current
 *   catalog data.  `export const dynamic = "force-dynamic"` is
 *   respected here, and `Cache-Control: no-store` prevents CDN/proxy
 *   caching.
 *
 * URLs are derived directly from the catalog data (src/lib/catalog-data.ts),
 * so the sitemap is always in sync with the live site — no stale links,
 * no 404s.
 *
 * Image sitemap (Google Images / Яндекс.Картинки):
 *   We embed <image:image> elements per Google's image sitemap extension.
 *   Google/Yandex will register the images in image search; the
 *   title/caption come from the page's own <meta> and alt attributes
 *   at crawl time.
 *
 * Submit this sitemap in:
 *   - Yandex.Webmaster: https://webmaster.yandex.ru/site/https:gravikot.ru/
 *   - Google Search Console: https://search.google.com/search-console
 */

// Route Handlers honour this directive — no pre-render, no ISR cache.
export const dynamic = "force-dynamic";

const BASE_URL = "https://gravikot.ru";

/** Convert a possibly-relative image path to an absolute URL. */
function absImg(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Escape XML special characters in a URL or text value. */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Format a Date as YYYY-MM-DD for <lastmod>. */
function lastmodDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function GET() {
  const lastmod = lastmodDate();

  const entries: string[] = [];

  // ── Static pages ────────────────────────────────────────────────
  const staticPages = [
    { url: BASE_URL, freq: "weekly", priority: "1.0", images: [`${BASE_URL}/assets/gravikot-poster.webp`] },
    { url: `${BASE_URL}/catalog`, freq: "weekly", priority: "0.9", images: categories.map((c) => c.products[0]?.src).filter((s): s is string => Boolean(s)).map(absImg).filter((s): s is string => Boolean(s)) },
    { url: `${BASE_URL}/about`, freq: "monthly", priority: "0.5", images: undefined },
    { url: `${BASE_URL}/delivery`, freq: "monthly", priority: "0.5", images: undefined },
    { url: `${BASE_URL}/privacy`, freq: "yearly", priority: "0.3", images: undefined },
    { url: `${BASE_URL}/terms`, freq: "yearly", priority: "0.3", images: undefined },
  ];

  for (const p of staticPages) {
    entries.push(urlEntry(p.url, lastmod, p.freq, p.priority, p.images as string[] | undefined));
  }

  // ── Category pages ──────────────────────────────────────────────
  for (const cat of categories) {
    const images = cat.products.map((p) => p.src).filter((s): s is string => Boolean(s)).map(absImg).filter((s): s is string => Boolean(s));
    entries.push(urlEntry(`${BASE_URL}${categoryUrl(cat)}`, lastmod, "weekly", "0.8", images));
  }

  // ── Product pages ───────────────────────────────────────────────
  for (const cat of categories) {
    for (const prod of cat.products) {
      const allImages = [prod.src, ...(prod.gallery ?? [])].filter((s): s is string => Boolean(s)).map(absImg).filter((s): s is string => Boolean(s));
      entries.push(urlEntry(`${BASE_URL}${productUrl(cat, prod)}`, lastmod, "monthly", "0.7", allImages));
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join("\n")}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "X-Robots-Tag": "noindex", // sitemap itself shouldn't be indexed
    },
  });
}

/** Build a single <url> element with optional <image:image> children. */
function urlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: string,
  images?: string[],
): string {
  const imageTags = images
    ? images
        .map((img) => `    <image:image>
      <image:loc>${xmlEscape(img)}</image:loc>
    </image:image>`)
        .join("\n")
    : "";

  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${imageTags}
  </url>`;
}
