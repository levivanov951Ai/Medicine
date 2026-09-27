import type { NextConfig } from "next";

/**
 * Security-заголовки, одинаковые для всех запросов.
 *
 * ⚠️ DEFERRED (production-hardening): Content-Security-Policy сюда
 * намеренно не включён. Проверено 2026-09-27: строгая статическая CSP
 * в next.config.ts ломает встроенные инлайн-скрипты гидратации App Router;
 * CSP на nonce через middleware работает только на динамических страницах —
 * статически собранные (`○`, без middleware на каждый запрос) остаются
 * без nonce, и их скрипты не выполняются.
 *
 * Решать не костылём (не делать все страницы dynamic только ради CSP,
 * не ставить 'unsafe-inline'/'unsafe-eval' ради галочки), а спроектировать
 * заново — после того как определятся финальные внешние интеграции (CRM,
 * возможная аналитика/карта) и итоговая модель рендеринга страниц.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HTTPS-only заголовок; браузеры игнорируют его по http, поэтому безопасен и локально.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // Не выдавать версию Next.js в заголовке X-Powered-By.
  poweredByHeader: false,

  // Источник данных (mock | crm) — не секрет: нужен и серверному, и браузерному коду
  // (запись, вход и кабинет работают в браузере). См. src/services/config.ts.
  env: {
    DATA_SOURCE: process.env.DATA_SOURCE ?? "mock",
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...securityHeaders,
          // Второй слой поверх meta robots (layout.tsx, site-config.ts) и robots.txt —
          // на случай краулера, который читает только заголовок ответа.
          ...(process.env.NEXT_PUBLIC_SITE_ENV === "production"
            ? []
            : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
        ],
      },
    ];
  },
};

export default nextConfig;
