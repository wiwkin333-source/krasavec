import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ГРАВИКОТ - Кружка, бокал с подсветкой и гравировкой по фото",
  description: "ГРАВИКОТ — мастерская премиальной лазерной гравировки. Светящиеся сувениры, бокалы, аксессуары по вашим фото и логотипам. Доставка по России.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180" },
      { url: "/apple-touch-icon-precomposed.png?v=2", sizes: "180x180" },
    ],
  },
  manifest: "/site.webmanifest",
  other: {
    "msapplication-TileColor": "#050510",
    "msapplication-config": "/browserconfig.xml",
  },
  openGraph: {
    title: "ГРАВИКОТ - Кружка, бокал с подсветкой и гравировкой по фото",
    description: "Светящиеся бокалы, сувениры и аксессуары по вашим фото. Доставка по России.",
    type: "website",
    locale: "ru_RU",
    siteName: "ГРАВИКОТ",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#050510",
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
        <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#050510" />
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
