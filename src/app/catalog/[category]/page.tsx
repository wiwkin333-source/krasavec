import type { Metadata } from "next";
import { categories, categoryBySlug, categoryUrl, minCategoryPrice } from "@/lib/catalog-data";
import { CategoryPageClient } from "./CategoryPageClient";
import { Breadcrumbs } from "@/components/gravikot/Breadcrumbs";
import { notFound } from "next/navigation";

const SITE_URL = "https://gravikot.ru";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const cat = categoryBySlug[slug];
  if (!cat) return {};

  const productNames = cat.products.map((p) => p.name).join(", ");
  const minPrice = minCategoryPrice(cat);
  const productType = cat.key === 'vision' ? 'кружки' : 'бокалы';
  const productTypeAlt = cat.key === 'vision' ? 'кружки, чашки' : 'бокалы, фужеры, стаканы';
  const title = `${productType} со светящейся гравировкой — коллекция ${cat.title} | ГРАВИКОТ`;
  const description = `Коллекция ${cat.title}: ${productNames}. ${productTypeAlt} со светящейся гравировкой по фото от ГРАВИКОТ. Уникальные подарки и сувениры с подсветкой. Цены от ${minPrice} ₽. Доставка по России.`;
  const canonicalUrl = `${SITE_URL}${categoryUrl(cat)}`;

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
      images: cat.products[0]?.src
        ? [{ url: cat.products[0].src, width: 800, height: 800, alt: `${productType} со светящейся гравировкой — коллекция ${cat.title}` }]
        : [],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const cat = categoryBySlug[slug];
  if (!cat) notFound();

  const canonicalUrl = `${SITE_URL}${categoryUrl(cat)}`;

  return (
    <main className="min-h-screen bg-[#050510] text-foreground">
      {/* SEO: BreadcrumbList JSON-LD only — no visible DOM to avoid cloaking risk.
          Search engines get structured data; users see the category title as navigation. */}
      <Breadcrumbs
        items={[
          { name: "Главная", href: "/" },
          { name: "Каталог", href: "/catalog" },
          { name: cat.title },
        ]}
        currentUrl={canonicalUrl}
        visible={false}
      />

      {/* Category title — strictly one H1 per page */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-4">
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl"
          style={{ color: cat.accent }}
        >
          {cat.title}
        </h1>
        <p className="mt-2 text-foreground/50 font-tech text-sm tracking-wide">
          точность, стиль, качество
        </p>
        <div
          className="mt-3 h-px w-24"
          style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }}
        />
      </section>

      {/* Products grid + back button (client component) */}
      <CategoryPageClient cat={cat} showBackButton />

      {/* SEO: hidden text block for search engines — not visible to users */}
      <div className="sr-only" aria-hidden="true">
        {cat.key === 'vision'
          ? 'Кружки и чашки со светящейся гравировкой по фото от ГРАВИКОТ. Кружка с гравировкой, чашка с гравировкой — уникальные светящиеся сувениры и подарки. Лазерная гравировка на кружках и чашках.'
          : 'Бокалы, фужеры и стаканы со светящейся гравировкой по фото от ГРАВИКОТ. Бокал с гравировкой, фужер с гравировкой, стакан с гравировкой — уникальные светящиеся сувениры и подарки. Лазерная гравировка на бокалах, фужерах и стаканах.'
        }
      </div>
    </main>
  );
}
