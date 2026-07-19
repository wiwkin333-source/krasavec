import Link from "next/link";

export const metadata = {
  title: "Страница не найдена — ГРАВИКОТ",
  description: "Запрашиваемая страница не найдена.",
  robots: {
    index: false,
    follow: false,
  },
  // Override the inherited root canonical (https://gravikot.ru) with an
  // empty value. A 404 must NOT claim to be a canonical copy of the
  // homepage — that would conflict with the noindex robots directive and
  // confuse Search Console. Leaving canonical unset would inherit the
  // root layout's value, so we explicitly blank it here.
  alternates: {
    canonical: "",
  },
};

export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#050510] text-foreground flex items-center justify-center">
      <div className="text-center px-6 max-w-lg">
        <div className="font-display font-extrabold text-8xl md:text-9xl bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          404
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl mb-3">
          Страница не найдена
        </h1>
        <p className="text-foreground/60 text-base mb-8">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/30 text-sky-300 hover:text-white hover:border-sky-400/60 transition font-tech text-sm"
        >
          ← На главную
        </Link>
      </div>
    </main>
  );
}
