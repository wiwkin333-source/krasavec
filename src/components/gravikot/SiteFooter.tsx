"use client";

import Link from "next/link";
import { PawPrint } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Бренд + налоги */}
        <div>
          <div className="font-display font-black uppercase text-2xl animate-pulse-glow flex items-center">
            <span className="shimmer-text">ГРАВИК</span>
            <PawPrint className="w-6 h-6 mx-0.5" style={{ color: "#ff2bd6", filter: "drop-shadow(0 0 8px #ff2bd6)" }} aria-hidden="true" />
            <span className="shimmer-text">Т</span>
          </div>
          <p className="text-sky-100/90 text-sm mt-3 font-tech">Кружки и бокалы со светящейся гравировкой по фото</p>
          {/* Плачу налоги */}
          <a
            href="/images/fns-extract.webp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-400/20 hover:bg-emerald-500/20 transition text-xs"
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">&fnof;</span>
            <span className="text-emerald-300 font-tech">Плачу налоги</span>
          </a>
        </div>

        {/* Контакты */}
        <nav aria-label="Контакты">
          <div className="font-display font-semibold mb-2">Контакты:</div>
          <div className="flex flex-col gap-1.5">
            <span className="text-sky-100/60 text-sm">Самара</span>
            <a href="tel:+79258343045" className="text-sky-300 hover:text-white transition text-sm">+7 (925) 834-30-45</a>
            <a href="mailto:kyriptor@yandex.ru" className="text-sky-300 hover:text-white transition text-sm">kyriptor@yandex.ru</a>
            <span className="text-sky-100/50 text-xs">Ежедневно 9:00–23:00 по Мск</span>
            <div className="flex gap-3 mt-1">
              <a href="https://t.me/gravikotik" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white transition text-sm">Telegram</a>
              <a href="https://vk.com/club239806069" target="_blank" rel="noopener noreferrer" className="text-sky-300 hover:text-white transition text-sm">ВКонтакте</a>
            </div>
          </div>
        </nav>

        {/* Информация */}
        <nav aria-label="Информация">
          <div className="font-display font-semibold mb-2">Информация:</div>
          <div className="space-y-2">
            <Link href="/about" className="block text-sky-300 hover:text-white transition text-sm">О компании</Link>
            <Link href="/delivery" className="block text-sky-300 hover:text-white transition text-sm">Доставка и оплата</Link>
            <Link href="/privacy" className="block text-sky-300 hover:text-white transition text-sm">Политика конфиденциальности</Link>
            <Link href="/terms" className="block text-sky-300 hover:text-white transition text-sm">Пользовательское соглашение</Link>
          </div>
        </nav>

        {/* Реквизиты */}
        <div className="text-sky-100/60 text-sm space-y-1.5">
          <div className="font-display font-semibold text-sky-100/70 mb-2">Реквизиты:</div>
          <div>Самозанятый</div>
          <div>Курипта Д. В.</div>
          <div>ИНН 501721586348</div>
          <div className="pt-4 text-sky-100/40">
            &copy; {new Date().getFullYear()} ГРАВИКОТ. Все права защищены
          </div>
        </div>
      </div>
    </footer>
  );
}
