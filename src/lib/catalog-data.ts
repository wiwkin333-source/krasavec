/**
 * Shared catalog data with SEO-friendly transliterated slugs.
 * Used by both Gallery (main page) and /catalog/* route pages.
 *
 * Slug rules:
 *  - Russian → Latin transliteration
 *  - lowercase, hyphens for spaces
 *  - no Cyrillic in URLs
 */

// ===== Transliteration =====

const TRANSLIT_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts",
  ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

export function transliterate(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT_MAP[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ===== Product type =====

export interface Product {
  name: string;
  slug: string;
  desc: string;
  price: string;
  src?: string;
  gallery?: string[];
}

// ===== Category type =====

export interface Category {
  key: string;
  slug: string;
  title: string;
  accent: string;
  products: Product[];
}

// ===== Product image paths =====

const productImages: Record<number, string> = {
  2: "/assets/products/p2.webp",
  3: "/assets/products/p3.webp",
  5: "/assets/products/p5.webp",
  6: "/assets/products/p6.webp",
  7: "/assets/products/p7.webp",
  8: "/assets/products/p8.webp",
  9: "/assets/products/p9.webp",
  10: "/assets/products/p10.webp",
};
const img = (n: number) => productImages[n];

const glass1 = "/assets/products/glass-1.webp";
const glass2 = "/assets/products/glass-2.webp";
const flute1 = "/assets/products/flute-1.webp";
const flute2 = "/assets/products/flute-2.webp";
const dresden1 = "/assets/products/dresden-1.webp";
const dresden2 = "/assets/products/dresden-2.webp";
const gramine1 = "/assets/products/gramine-1.webp";
const gramine2 = "/assets/products/gramine-2.webp";
const gramine3 = "/assets/products/gramine-3.webp";
const gramine4 = "/assets/products/gramine-4.webp";
const gramine5 = "/assets/products/gramine-5.webp";
const gramine6 = "/assets/products/gramine-6.webp";
const gramine7 = "/assets/products/gramine-7.webp";
const maag1 = "/assets/products/maag-1.webp";
const maag2 = "/assets/products/maag-2.webp";
const maag3 = "/assets/products/maag-3.webp";
const maag4 = "/assets/products/maag-4.webp";
const maag5 = "/assets/products/maag-5.webp";
const maag6 = "/assets/products/maag-6.webp";
const collins1 = "/assets/products/collins-1.webp";
const collins2 = "/assets/products/collins-2.webp";
const collins3 = "/assets/products/collins-3.webp";
const collins4 = "/assets/products/collins-4.webp";

// ===== Categories with slugs =====

export const categories: Category[] = [
  {
    key: "vision",
    slug: "vizhn",
    title: "ВИЖН",
    accent: "#29e3ff",
    products: [
      {
        name: "Грамине",
        slug: "gramine",
        desc: "Теплый свет для теплых напитков.",
        price: "2499 ₽",
        src: img(5),
        gallery: [gramine1, gramine2, gramine3, gramine4, gramine5, gramine6, gramine7],
      },
      {
        name: "МААГ",
        slug: "maag",
        desc: "Когда твой вайб получает подсветку.",
        price: "2599 ₽",
        src: img(6),
        gallery: [maag1, maag2, maag3, maag4, maag5, maag6],
      },
      {
        name: "Коллинз",
        slug: "kollinz",
        desc: "Ваш коктейль. Ваш стиль. Ваш стакан.",
        price: "2399 ₽",
        src: img(7),
        gallery: [collins1, collins2, collins3, collins4],
      },
    ],
  },
  {
    key: "clear",
    slug: "kliar",
    title: "КЛИАР",
    accent: "#ff2bd6",
    products: [
      {
        name: "Гласс",
        slug: "glass",
        desc: "Для тех, кто любит быть в центре внимания.",
        price: "2599 ₽",
        src: img(8),
        gallery: [glass1, glass2],
      },
      {
        name: "ФЛЮТЕ",
        slug: "flyute",
        desc: "Превращает каждый тост в событие.",
        price: "2399 ₽",
        src: img(9),
        gallery: [flute1, flute2],
      },
      {
        name: "ДРЕЗДЕН",
        slug: "drezden",
        desc: "Для хорошего пива и отличных историй.",
        price: "2999 ₽",
        src: img(10),
        gallery: [dresden1, dresden2],
      },
    ],
  },
];

// ===== Lookup helpers =====

/** Category key → Category */
export const categoryByKey: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.key, c]),
);

/** Category slug → Category */
export const categoryBySlug: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
);

/** Build a full URL path for a category */
export function categoryUrl(cat: Category): string {
  return `/catalog/${cat.slug}`;
}

/** Build a full URL path for a product */
export function productUrl(cat: Category, prod: Product): string {
  return `/catalog/${cat.slug}/${prod.slug}`;
}

/** Find product by slug within a category */
export function findProduct(cat: Category, productSlug: string): Product | undefined {
  return cat.products.find((p) => p.slug === productSlug);
}
