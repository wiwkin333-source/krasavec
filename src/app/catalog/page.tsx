import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryUrl } from "@/lib/catalog-data";
import { Breadcrumbs } from "@/components/gravikot/Breadcrumbs";

export const metadata: Metadata = {
  title: "Каталог — ГРАВИКОТ | Светящаяся гравировка на стекле",
  description:
    "Каталог коллекций светящейся гравировки от ГРАВИКОТ. Кружки, бокалы и стаканы с уникальной глоу-арт гравировкой по вашему фото.",
  alternates: {
    canonical: "https://gravikot.ru/catalog",
  },
  openGraph: {
    title: "Каталог — ГРАВИКОТ",
    description:
      "Коллекции светящейся гравировки на стекле. Кружки, бокалы, стаканы с глоу-арт гравировкой.",
    url: "https://gravikot.ru/catalog",
    type: "website",
    locale: "ru_RU",
    siteName: "ГРАВИКОТ",
  },
};

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-[#050510] text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#050510]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
          <Breadcrumbs
            items={[
              { name: "Главная", href: "/" },
              { name: "Каталог" },
            ]}
          />
          <Link
            href="/"
            className="font-display text-sm tracking-[.08em] text-foreground/70 hover:text-sky-300 transition"
          >
            ГРАВИКОТ
          </Link>
        </div>
      </div>

      {/* Title */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground">
          Каталог
        </h1>
        <p className="mt-2 text-foreground/50 font-tech text-sm tracking-wide">
          Коллекции светящейся гравировки на стекле
        </p>
        <div className="mt-3 h-px w-24 bg-gradient-to-r from-sky-400/60 to-transparent" />
      </section>

      {/* Category cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={categoryUrl(cat)}
              className="group relative block rounded-2xl overflow-hidden glass conic-border"
              style={{ boxShadow: `0 12px 60px -20px ${cat.accent}` }}
            >
              {/* Category image */}
              {cat.products[0]?.src && (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.products[0].src}
                    alt={`Коллекция ${cat.title}`}
                    className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(20,10,40,0.6) 0%, rgba(5,5,16,0.9) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${cat.accent}33, transparent 70%)` }}
                  />
                </div>
              )}

              {/* Category info */}
              <div className="px-5 py-4 bg-black/80 backdrop-blur-sm">
                <h2
                  className="font-display text-xl sm:text-2xl"
                  style={{ color: cat.accent }}
                >
                  {cat.title}
                </h2>
                <p className="text-foreground/50 text-sm mt-1 font-tech">
                  {cat.products.length}{" "}
                  {cat.products.length === 1
                    ? "изделие"
                    : cat.products.length < 5
                    ? "изделия"
                    : "изделий"}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cat.products.map((p) => (
                    <span
                      key={p.slug}
                      className="text-xs font-tech text-foreground/40"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

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
