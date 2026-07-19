import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          // Block pagination query params to avoid duplicate content
          // Canonical URLs are set on all pages, but this prevents
          // crawlers from wasting crawl budget on ?page= variants
        ],
      },
    ],
    sitemap: "https://gravikot.ru/sitemap.xml",
  };
}
