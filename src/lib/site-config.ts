/**
 * Окружение сайта: staging/demo или production, разрешена ли индексация,
 * канонический адрес сайта. Единая точка для `layout.tsx`, `robots.ts`,
 * `sitemap.ts` и security-заголовков (`next.config.ts`).
 *
 * По умолчанию — staging: индексация выключена. Это осознанная защита:
 * реальный домен, юридическое название и часовой пояс клиники ещё UNKNOWN
 * (PROJECT_CONTEXT.md, раздел 6), рано пускать поисковики на сайт.
 * Включить индексацию для настоящего запуска — `NEXT_PUBLIC_SITE_ENV=production`.
 */
export type SiteEnv = "staging" | "production";

function readSiteEnv(): SiteEnv {
  return process.env.NEXT_PUBLIC_SITE_ENV === "production" ? "production" : "staging";
}

export const siteEnv: SiteEnv = readSiteEnv();

/** Индексация поисковиками разрешена только в production. */
export const indexingAllowed = siteEnv === "production";

/**
 * Канонический адрес сайта — для `metadataBase`, `sitemap.ts` и абсолютных
 * ссылок в `robots.txt`. UNKNOWN, пока не назначен домен: тогда абсолютные
 * адреса не строятся (см. использование в `layout.tsx`, `sitemap.ts`).
 */
export const siteUrl: string | null = process.env.NEXT_PUBLIC_SITE_URL?.trim() || null;

/**
 * Защита от случайного запуска: демо-подсказка «Демо-код: 11111» (PD-26)
 * не должна показаться настоящим пациентам на проиндексированном сайте.
 * production обязан идти без NEXT_PUBLIC_DEMO_MODE.
 */
if (siteEnv === "production" && process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
  throw new Error(
    "NEXT_PUBLIC_SITE_ENV=production вместе с NEXT_PUBLIC_DEMO_MODE=true: подсказка с тестовым кодом " +
      "не должна показываться настоящим пациентам. Уберите NEXT_PUBLIC_DEMO_MODE перед запуском.",
  );
}
