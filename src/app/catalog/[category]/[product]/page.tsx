import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryBySlug, findProduct, categoryUrl, productUrl, extractPrice } from "@/lib/catalog-data";
import { ProductPageClient } from "./ProductPageClient";
import { Breadcrumbs } from "@/components/gravikot/Breadcrumbs";
import { notFound } from "next/navigation";

const SITE_URL = "https://gravikot.ru";

interface Props {
  params: Promise<{ category: string; product: string }>;
}

export async function generateStaticParams() {
  const params: { category: string; product: string }[] = [];
  for (const cat of categories) {
    for (const prod of cat.products) {
      params.push({ category: cat.slug, product: prod.slug });
    }
  }
  return params;
}

function buildProductJsonLd(cat: { slug: string; title: string; accent: string }, prod: { name: string; desc: string; price: string; src?: string; slug: string }) {
  const url = `${SITE_URL}${productUrl(cat as any, prod as any)}`;
  const priceNum = extractPrice(prod.price);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: prod.name,
    description: prod.desc,
    url,
    image: prod.src ? `${SITE_URL}${prod.src}` : undefined,
    brand: {
      "@type": "Brand",
      name: "ГРАВИКОТ",
    },
    offers: {
      "@type": "Offer",
      price: priceNum,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "ГРАВИКОТ",
      },
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catSlug, product: prodSlug } = await params;
  const cat = categoryBySlug[catSlug];
  if (!cat) return {};
  const prod = findProduct(cat, prodSlug);
  if (!prod) return {};

  const priceNum = extractPrice(prod.price);
  // Title: "Купить Грамине, цена от 2499 ₽ | ГРАВИКОТ" ≈ 40 chars ✅ (≤65)
  const title = `Купить ${prod.name}, цена от ${priceNum} ₽ | ГРАВИКОТ`;
  // Strip trailing period from desc to avoid double punctuation
  const cleanDesc = prod.desc.replace(/\.\s*$/, "");
  const description = `Купить ${prod.name} — ${cleanDesc}. Коллекция ${cat.title}. Цена ${prod.price}. Светящаяся гравировка на стекле. Доставка по России.`;
  const canonicalUrl = `${SITE_URL}${productUrl(cat, prod)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: "ru_RU",
      siteName: "ГРАВИКОТ",
      images: prod.src
        ? [{ url: prod.src, width: 800, height: 800, alt: `${prod.name} — гравировка на стекле` }]
        : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category: catSlug, product: prodSlug } = await params;
  const cat = categoryBySlug[catSlug];
  if (!cat) notFound();
  const prod = findProduct(cat, prodSlug);
  if (!prod) notFound();

  const productJsonLd = buildProductJsonLd(cat, prod);
  const canonicalUrl = `${SITE_URL}${productUrl(cat, prod)}`;

  return (
    <main className="min-h-screen bg-[#050510] text-foreground">
      {/* Product structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Header breadcrumb */}
      <div className="sticky top-0 z-30 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Breadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Каталог", href: "/catalog" },
              { name: cat.title, href: categoryUrl(cat) },
              { name: prod.name },
            ]}
            currentUrl={canonicalUrl}
          />
          <Link
            href="/"
            className="font-display text-sm tracking-[.08em] text-foreground/70 hover:text-sky-300 transition hidden sm:block"
          >
            ГРАВИКОТ
          </Link>
        </div>
      </div>

      {/* Product detail */}
      <ProductPageClient cat={cat} prod={prod} />
    </main>
  );
}
