import type { Metadata } from "next";
import Link from "next/link";
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
  // Title: ≤65 chars. "Коллекция ВИЖН — светящаяся гравировка | ГРАВИКОТ" = 49
  const title = `Коллекция ${cat.title} — светящаяся гравировка | ГРАВИКОТ`;
  const description = `Коллекция ${cat.title}: ${productNames}. Светящаяся гравировка на стекле от ГРАВИКОТ. Цены от ${minPrice} ₽. Доставка по России.`;
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
        ? [{ url: cat.products[0].src, width: 800, height: 800, alt: `Коллекция ${cat.title}` }]
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
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Breadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Каталог", href: "/catalog" },
              { name: cat.title },
            ]}
            currentUrl={canonicalUrl}
          />
          <Link
            href="/"
            className="font-display text-sm tracking-[.08em] text-foreground/70 hover:text-sky-300 transition"
          >
            ГРАВИКОТ
          </Link>
        </div>
      </div>

      {/* Category title — strictly one H1 per page */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl"
          style={{ color: cat.accent }}
        >
          {cat.title}
        </h1>
        <p className="mt-2 text-foreground/50 font-tech text-sm tracking-wide">
          Коллекция светящейся гравировки
        </p>
        <div
          className="mt-3 h-px w-24"
          style={{ background: `linear-gradient(90deg, ${cat.accent}, transparent)` }}
        />
      </section>

      {/* Products grid */}
      <CategoryPageClient cat={cat} />

      {/* Footer link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-sky-300 hover:text-white hover:scale-105 transition font-tech text-sm"
        >
          &larr; Вернуться на главную
        </Link>
      </div>
    </main>
  );
}
