import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ГРАВИКОТ — Премиальная лазерная гравировка",
  description: "ГРАВИКОТ — мастерская премиальной лазерной гравировки на стекле, металле, дереве и коже. Светящиеся сувениры, бокалы, аксессуары по вашим фото и логотипам. Доставка по России.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "ГРАВИКОТ — Премиальная лазерная гравировка на стекле",
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
