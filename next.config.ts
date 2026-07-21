import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Remove X-Powered-By: Next.js header
  poweredByHeader: false,
  // Enable gzip compression
  compress: true,
  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
  },
  // Single-step redirects — NO chains
  async redirects() {
    return [
      // ===== Mirror consolidation: http → https (301 permanent) =====
      // Fires when the upstream proxy/load-balancer signals the original
      // request was plain HTTP via the X-Forwarded-Proto header. Caddyfile
      // already forwards this header (header_up X-Forwarded-Proto {scheme}).
      // This consolidates all http://gravikot.ru/* onto https://gravikot.ru/*
      // and also catches http://www.gravikot.ru/* (single hop).
      {
        source: "/:path*",
        has: [
          {
            type: "header",
            key: "x-forwarded-proto",
            value: "http",
          },
        ],
        destination: "https://gravikot.ru/:path*",
        permanent: true,
      },
      // ===== Mirror consolidation: www → non-www (301 permanent) =====
      // Yandex and Google both use 301 (not the robots.txt `Host:` directive,
      // which is deprecated). This single rule consolidates all link equity
      // onto the canonical https://gravikot.ru host.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.gravikot.ru",
          },
        ],
        destination: "https://gravikot.ru/:path*",
        permanent: true,
      },
      // Trailing slash redirect — single step to non-trailing
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
      // Common misspellings / old URLs → single redirect to correct page
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/shop",
        destination: "/",
        permanent: true,
      },
      {
        source: "/product",
        destination: "/",
        permanent: true,
      },
      {
        source: "/products",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contacts",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/order",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "/",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "/",
        permanent: true,
      },
      {
        source: "/oplata",
        destination: "/delivery",
        permanent: true,
      },
      {
        source: "/dostavka",
        destination: "/delivery",
        permanent: true,
      },
      {
        source: "/politika",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/usloviya",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
  // Security headers + caching
  async headers() {
    return [
      // ==========================================
      // 🔐 SECURITY HEADERS — all routes
      // ==========================================
      {
        source: "/(.*)",
        headers: [
          // Protection against MIME-type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Protection against clickjacking — same origin only
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          // Enable browser XSS filter
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Control Referer header leakage
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Disable sensitive browser APIs not used by this site
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Content Security Policy — adapted for this site:
          // - Google Fonts (fonts.googleapis.com, fonts.gstatic.com)
          // - Next.js requires 'unsafe-inline' + 'unsafe-eval' for scripts
          // - Inline styles from Tailwind and dynamic CSS need 'unsafe-inline'
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // Force HTTPS — 1 year with subdomains and preload list
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
      // ==========================================
      // 📦 CACHING HEADERS — per route type
      // ==========================================
      // Static assets — long cache
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Favicon — 1 day cache
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      // WebP images — long cache
      {
        source: "/(.*)?.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API routes — noindex, no cache
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
      // _next internal — noindex
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      // Pagination query params — noindex to avoid duplicate content
      // Only the clean canonical URLs should be indexed
      {
        source: "/catalog/:path*",
        has: [
          {
            type: "query",
            key: "page",
          },
        ],
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      // Sort/filter query params — noindex for any URL with these params,
      // regardless of path. Prevents duplicate-content indexing when bots
      // crawl /catalog/vizhn?sort=price, /catalog?filter=cheap, etc.
      // Canonical tags on each page also point at the clean URL, so this is
      // belt-and-suspenders: even if a bot ignores canonical, the noindex
      // header keeps the variant out of the index.
      {
        source: "/:path*",
        has: [{ type: "query", key: "sort" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "filter" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "order" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "utm_source" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "utm_medium" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "utm_campaign" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "gclid" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "fbclid" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        has: [{ type: "query", key: "yclid" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
