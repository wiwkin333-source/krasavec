import { categories, categoryUrl, productUrl } from "@/lib/catalog-data";
import { NextResponse } from "next/server";

/**
 * Emergency sitemap API route — bypasses Next.js ISR cache.
 *
 * The standard sitemap.ts route works correctly in local dev but on Amvera
 * (and possibly other hosts with persistent ISR storage), a stale cached
 * version with only 3 URLs persists even after setting revalidate=0 and
 * dynamic="force-dynamic". This route generates the XML string manually
 * and returns it as a plain Response, completely sidestepping the ISR
 * caching layer.
 *
 * robots.txt should reference this route as the canonical sitemap URL.
 */

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://gravikot.ru";

export async function GET() {
  const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [];

  // Static pages
  urls.push(
    { loc: BASE_URL, lastmod: now, changefreq: "weekly", priority: "1.0" },
    { loc: `${BASE_URL}/catalog`, lastmod: now, changefreq: "weekly", priority: "0.9" },
    { loc: `${BASE_URL}/about`, lastmod: now, changefreq: "monthly", priority: "0.5" },
    { loc: `${BASE_URL}/delivery`, lastmod: now, changefreq: "monthly", priority: "0.5" },
    { loc: `${BASE_URL}/privacy`, lastmod: now, changefreq: "yearly", priority: "0.3" },
    { loc: `${BASE_URL}/terms`, lastmod: now, changefreq: "yearly", priority: "0.3" },
  );

  // Category pages
  for (const cat of categories) {
    urls.push({
      loc: `${BASE_URL}${categoryUrl(cat)}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  // Product pages
  for (const cat of categories) {
    for (const prod of cat.products) {
      urls.push({
        loc: `${BASE_URL}${productUrl(cat, prod)}`,
        lastmod: now,
        changefreq: "monthly",
        priority: "0.7",
      });
    }
  }

  // Build XML manually — no Next.js sitemap serializer, no ISR cache involvement
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",

    },
  });
}
