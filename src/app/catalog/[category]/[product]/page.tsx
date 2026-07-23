import type { Metadata } from "next";
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

function buildProductJsonLd(cat: { slug: string; title: string; accent: string; key: string }, prod: { name: string; desc: string; price: string; src?: string; slug: string }) {
  const url = `${SITE_URL}${productUrl(cat as any, prod as any)}`;
  const priceNum = extractPrice(prod.price);
  const productType = cat.key === 'vision' ? 'Кружка' : 'Бокал';
  const productTypeAlt = cat.key === 'vision' ? 'кружка, чашка' : 'бокал, фужер, стакан';
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${productType} ${prod.name} со светящейся гравировкой`,
    description: `${productType} ${prod.name} со светящейся гравировкой по фото. ${prod.desc.replace(/\.\s*$/, "")}. Также доступны: ${productTypeAlt}.`,
    url,
    image: prod.src ? `${SITE_URL}${prod.src}` : undefined,
    category: productType,
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
  // SEO: include product type (кружка/чашка/бокал/фужер/стакан) in title for generic search queries
  const productType = cat.key === 'vision' ? 'кружка' : 'бокал';
  const productTypeAlt = cat.key === 'vision' ? 'кружка, чашка' : 'бокал, фужер, стакан';
  const title = `Купить ${productType} ${prod.name} со светящейся гравировкой, цена от ${priceNum} ₽ | ГРАВИКОТ`;
  const cleanDesc = prod.desc.replace(/\.\s*$/, "");
  const description = `${productTypeAlt} ${prod.name} со светящейся гравировкой по фото — ${cleanDesc}. Коллекция ${cat.title}. Цена ${prod.price}. Уникальный подарок с подсветкой. Доставка по России.`;
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
        ? [{ url: prod.src, width: 800, height: 800, alt: `${productType} ${prod.name} со светящейся гравировкой` }]
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
    <>
      {/* SEO: structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* SEO: H1 rendered as visible text inside ProductPageClient top bar.
          The product name in the gallery title bar IS the H1 — no cloaking. */}
      <ProductPageClient cat={cat} prod={prod} />
    </>
  );
}
