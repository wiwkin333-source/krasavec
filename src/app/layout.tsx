import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ГРАВИКОТ - Кружка, бокал с подсветкой и гравировкой по фото",
  description: "ГРАВИКОТ — мастерская премиальной лазерной гравировки. Светящиеся сувениры, бокалы, аксессуары по вашим фото и логотипам. Доставка по России.",
  icons: {
    icon: [
      // SVG favicon — highest priority for modern browsers
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      // ICO — universal fallback (contains 16/24/32/48/64)
      { url: "/favicon.ico?v=4", sizes: "16x16 24x24 32x32 48x48 64x64" },
      // PNG — explicit sizes for browsers that prefer them
      { url: "/favicon-16x16.png?v=4", sizes: "16x16", type: "image/png" },
      { url: "/favicon-24x24.png?v=4", sizes: "24x24", type: "image/png" },
      { url: "/favicon-32x32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=4", sizes: "48x48", type: "image/png" },
      { url: "/favicon-64x64.png?v=4", sizes: "64x64", type: "image/png" },
      { url: "/favicon-96x96.png?v=4", sizes: "96x96", type: "image/png" },
      { url: "/favicon-128x128.png?v=4", sizes: "128x128", type: "image/png" },
      { url: "/favicon-196x196.png?v=4", sizes: "196x196", type: "image/png" },
    ],
    apple: [
      // All iOS device sizes
      { url: "/apple-touch-icon-120x120.png?v=4", sizes: "120x120" },
      { url: "/apple-touch-icon-152x152.png?v=4", sizes: "152x152" },
      { url: "/apple-touch-icon-167x167.png?v=4", sizes: "167x167" },
      { url: "/apple-touch-icon.png?v=4", sizes: "180x180" },
      { url: "/apple-touch-icon-precomposed.png?v=4", sizes: "180x180" },
    ],
    shortcut: [
      { url: "/favicon.ico?v=4" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#050510",
    "msapplication-TileImage": "/mstile-150x150.png?v=4",
    "msapplication-square70x70logo": "/mstile-70x70.png?v=4",
    "msapplication-square150x150logo": "/mstile-150x150.png?v=4",
    "msapplication-square310x310logo": "/mstile-310x310.png?v=4",
    "msapplication-wide310x150logo": "/mstile-310x150.png?v=4",
    "msapplication-config": "/browserconfig.xml",
  },
  openGraph: {
    title: "ГРАВИКОТ - Кружка, бокал с подсветкой и гравировкой по фото",
    description: "Светящиеся бокалы, сувениры и аксессуары по вашим фото. Доставка по России.",
    type: "website",
    locale: "ru_RU",
    siteName: "ГРАВИКОТ",
    images: [
      {
        url: "/og-image.png?v=4",
        width: 1200,
        height: 1200,
        alt: "ГРАВИКОТ — Лазерное ателье",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "ГРАВИКОТ - Кружка, бокал с подсветкой и гравировкой по фото",
    description: "Светящиеся бокалы, сувениры и аксессуары по вашим фото. Доставка по России.",
    images: ["/og-image.png?v=4"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050510" },
    { media: "(prefers-color-scheme: light)", color: "#050510" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Exo+2:wght@400;600&family=Bebas+Neue&display=swap"
        />
        {/* Safari pinned tab & macOS Touch Bar */}
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=4" color="#050510" />
        {/* Apple startup images for PWA — explicit link for iOS */}
        <link rel="apple-touch-startup-image" href="/apple-touch-icon.png?v=4" />
      </head>
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
        <Toaster />
        {/* Disable right-click on images/videos */}
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener('contextmenu',function(e){if(e.target.tagName==='IMG'||e.target.tagName==='VIDEO'||e.target.closest('img')||e.target.closest('video'))e.preventDefault()});` }} />
      </body>
    </html>
  );
}
