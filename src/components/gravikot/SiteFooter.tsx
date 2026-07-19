"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="font-display font-black uppercase text-2xl animate-pulse-glow flex items-center">
            <span className="shimmer-text">ГРАВИК</span>
            <PawPrint className="w-6 h-6 mx-0.5" style={{ color: "#ff2bd6", filter: "drop-shadow(0 0 8px #ff2bd6)" }} aria-hidden="true" />
            <span className="shimmer-text">Т</span>
          </div>
          <p className="text-sky-100/90 text-sm mt-3 font-tech">Кружки и бокалы со светящейся гравировкой по фото</p>
        </div>
        <nav aria-label="Контакты">
          <div className="font-display font-semibold mb-2">Контакты:</div>
          <div className="flex flex-col gap-1">
            <a href="tel:+79258343045" className="text-sky-300 hover:text-white transition text-sm">+7 (925) 834-30-45</a>
            <a href="mailto:gravikotik@yandex.ru" className="text-sky-300 hover:text-white transition text-sm">gravikotik@yandex.ru</a>
            <a href="https://t.me/gravikotik" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white transition text-sm">Telegram: @gravikotik</a>
            <a href="https://vk.com/club239806069" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white transition text-sm">ВКонтакте: ГРАВИКОТ</a>
          </div>
        </nav>
        <nav aria-label="Документы">
          <div className="font-display font-semibold mb-2">Документы:</div>
          <div className="space-y-2">
            <Link href="/privacy" className="block text-sky-300 hover:text-white transition text-sm">Политика конфиденциальности</Link>
            <Link href="/terms" className="block text-sky-300 hover:text-white transition text-sm">Пользовательское соглашение</Link>
          </div>
        </nav>
        <div className="text-sky-100/85 text-sm whitespace-pre-line">
          &copy; {new Date().getFullYear()} ГРАВИКОТ. Все права защищены
        </div>
      </div>
    </footer>
  );
}
