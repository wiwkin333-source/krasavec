/**
 * Breadcrumb component with Schema.org/BreadcrumbList JSON-LD microdata.
 * The last item (current page) is rendered as a non-clickable <span>.
 */

interface BreadcrumbItem {
  name: string;
  href?: string; // undefined = current page (non-clickable)
}

function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.href ? { item: `https://gravikot.ru${item.href}` } : {}),
    })),
  };
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = buildBreadcrumbJsonLd(items);

  return (
    <>
      {/* JSON-LD structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visible breadcrumb trail */}
      <nav aria-label="Навигация по разделам" className="flex items-center gap-2 text-sm font-tech uppercase tracking-[.1em] flex-wrap">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-foreground/20 select-none">/</span>}
              {isLast || !item.href ? (
                /* Current page — non-clickable */
                <span className="text-foreground/70" aria-current="page">
                  {item.name}
                </span>
              ) : (
                /* Ancestor page — clickable link */
                <a
                  href={item.href}
                  className="text-foreground/50 hover:text-sky-300 transition"
                >
                  {item.name}
                </a>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
