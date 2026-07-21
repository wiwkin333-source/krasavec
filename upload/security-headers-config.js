// ============================================
// 📋 Security Headers для Next.js (gravikot.ru)
// ============================================
// 
// ⚠️ ИНСТРУКЦИЯ ПО ПРИМЕНЕНИЮ:
//
// 1. Откройте ваш файл: next.config.js (или next.config.mjs)
// 2. Добавьте/замените функцию async headers()
// 3. Сохраните и перезапустите: npm run build && npm run start
//
// ✅ Этот код НЕ меняет визуал сайта
// ✅ Только добавляет защитные HTTP-заголовки
// ✅ Совместим с Next.js App Router и Pages Router
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... ваши существующие настройки оставьте без изменений ...
  
  // Добавьте или обновите эту функцию headers():
  async headers() {
    return [
      {
        // Применяется ко всем маршрутам
        source: '/(.*)',
        headers: [
          // ==========================================
          // 🔐 КРИТИЧЕСКИЕ ЗАГОЛОВКИ БЕЗОПАСНОСТИ
          // ==========================================
          
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Защита от MIME-type sniffing атак
          // Браузер будет строго следовать указанному Content-Type

          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Защита от clickjacking
          // Разрешает встраивание только с того же домена

          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Включает встроенный фильтр XSS в браузере

          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Контролирует передачу заголовка Referer

          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
          // Отключает доступ к чувствительным API браузера

          // ==========================================
          // 🛡️ CONTENT SECURITY POLICY (CSP)
          // ==========================================
          // 
          // ⚠️ ВАЖНО: Если после добавления CSP что-то сломалось
          // (например, скрипты аналитики, виджеты, шрифты),
          // добавьте нужные домены в соответствующие директивы
          //
          // Пример: если используете Google Analytics, добавьте в script-src:
          // https://www.googletagmanager.com https://www.google-analytics.com
          
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.gravikot.ru wss://gravikot.ru",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },

          // ==========================================
          // 🔒 ДОПОЛНИТЕЛЬНЫЕ ЗАГОЛОВКИ
          // ==========================================

          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Принудительное HTTPS (уже есть, но усиливаем)

          {
            key: 'Expect-CT',
            value: 'enforce, max-age=30',
          },
          // Certificate Transparency

          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Агрессивное кеширование статических ресурсов
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// ============================================
// 📝 ЕСЛИ ИСПОЛЬЗУЕТЕ ESM (next.config.mjs):
// ============================================
/*
export default {
  async headers() {
    return [/* тот же массив headers *\/];
  },
};
*/
