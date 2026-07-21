# 🛡️ Руководство: Security Headers для gravikot.ru

## ✅ Что будет добавлено (без изменения визуала)

| Заголовок | Назначение | Влияние на сайт |
|-----------|------------|-----------------|
| `X-Content-Type-Options` | Защита от MIME-сниффинга | ❌ Никакого |
| `X-Frame-Options` | Защита от clickjacking | ❌ Никакого |
| `X-XSS-Protection` | Фильтр XSS в браузере | ❌ Никакого |
| `Referrer-Policy` | Контроль Referer | ❌ Никакого |
| `Permissions-Policy` | Блокировка API браузера | ❌ Никакого |
| `Content-Security-Policy` | Защита от XSS/инъекций | ⚠️ Может потребовать доработки |
| `Expect-CT` | Certificate Transparency | ❌ Никакого |

---

## 🚀 Быстрое применение

### Шаг 1: Откройте ваш `next.config.js`

```bash
# Найдите файл конфигурации
find . -name "next.config.*" -type f
```

### Шаг 2: Добавьте функцию `headers()`

Вставьте этот код **внутрь** вашего объекта конфигурации:

```javascript
const nextConfig = {
  // ... ваши существующие настройки ...
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; frame-ancestors 'self'"
          },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Expect-CT', value: 'enforce, max-age=30' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Шаг 3: Пересоберите и перезапустите

```bash
npm run build && npm run start
# или
yarn build && yarn start
```

---

## ⚠️ Если что-то сломалось после CSP

**Симптомы:**
- Не работают внешние скрипты (аналитика, виджеты)
- Не загружаются шрифты или изображения
- Ошибки в консоли браузера

**Решение — добавьте домены в CSP:**

```javascript
// Пример: если используете Google Analytics
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    // ^^^ добавьте нужные домены сюда
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // ^^^ для Google Fonts
    "img-src 'self' data: https: blob: https://cdn.example.com",
    // ^^^ для CDN с картинками
  ].join('; ')
}
```

---

## 🔍 Проверка после применения

```bash
curl -I https://gravikot.ru | grep -E "(X-Content|X-Frame|CSP|Referrer|Permissions)"
```

Должны появиться все новые заголовки.

---

## 📋 Чек-лист после внедрения

- [ ] Сайт открывается нормально
- [ ] Все скрипты работают
- [ ] Изображения загружаются
- [ ] Формы отправляются
- [ ] Консоль браузера без ошибок CSP

---

## 🆘 Откат при проблемах

Если что-то пошло не так — просто удалите функцию `headers()` из конфига и пересоберите:

```bash
npm run build && npm run start
```
