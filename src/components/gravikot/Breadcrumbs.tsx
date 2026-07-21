/**
 * Breadcrumb component with Schema.org/BreadcrumbList JSON-LD microdata.
 * The last item (current page) is rendered as a non-clickable <span>.
 *
 * Props:
 *  - items: breadcrumb trail (last item = current page, no href needed)
 *  - currentUrl: absolute URL of the current page (used in JSON-LD `item` for the last element)
 *  - visible: if false, only JSON-LD is rendered (no visible DOM) — avoids cloaking risk
 */

interface BreadcrumbItem {
  name: string;
  href?: string; // undefined = current page (non-clickable)
}

function buildBreadcrumbJsonLd(items: BreadcrumbItem[], currentUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const isLast = i === items.length - 1;
      const itemUrl = item.href
        ? `https://gravikot.ru${item.href}`
        : isLast && currentUrl
          ? currentUrl
          : undefined;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

export function Breadcrumbs({ items, currentUrl, visible = true }: { items: BreadcrumbItem[]; currentUrl?: string; visible?: boolean }) {
  const jsonLd = buildBreadcrumbJsonLd(items, currentUrl);

  return (
    <>
      {/* JSON-LD structured data for search engines — always rendered */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visible breadcrumb trail — only if visible=true to avoid cloaking */}
      {visible && (
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
      )}
    </>
  );
}
