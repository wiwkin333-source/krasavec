import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryBySlug, findProduct, categoryUrl, productUrl } from "@/lib/catalog-data";
import { ProductPageClient } from "./ProductPageClient";
import { notFound } from "next/navigation";

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: catSlug, product: prodSlug } = await params;
  const cat = categoryBySlug[catSlug];
  if (!cat) return {};
  const prod = findProduct(cat, prodSlug);
  if (!prod) return {};

  const title = `${prod.name} — ${cat.title} | ГРАВИКОТ`;
  const description = `${prod.name}: ${prod.desc} Коллекция ${cat.title}. Светящаяся гравировка на стекле от ГРАВИКОТ. ${prod.price}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://gravikot.ru${productUrl(cat, prod)}`,
    },
    openGraph: {
      title,
      description,
      url: `https://gravikot.ru${productUrl(cat, prod)}`,
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

  return (
    <main className="min-h-screen bg-[#050510] text-foreground">
      {/* Header breadcrumb */}
      <div className="sticky top-0 z-30 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm font-tech uppercase tracking-[.1em] flex-wrap">
            <Link href="/" className="text-foreground/50 hover:text-sky-300 transition">
              Главная
            </Link>
            <span className="text-foreground/20">/</span>
            <Link href="/catalog" className="text-foreground/50 hover:text-sky-300 transition">
              Каталог
            </Link>
            <span className="text-foreground/20">/</span>
            <Link
              href={categoryUrl(cat)}
              className="hover:text-sky-300 transition"
              style={{ color: cat.accent + "aa" }}
            >
              {cat.title}
            </Link>
            <span className="text-foreground/20">/</span>
            <span className="text-foreground/70">{prod.name}</span>
          </div>
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
