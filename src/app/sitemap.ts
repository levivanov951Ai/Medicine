import type { MetadataRoute } from "next";
import { legalDocuments } from "@/data/legal";
import { routes } from "@/lib/routes";
import { indexingAllowed, siteUrl } from "@/lib/site-config";
import { dataSource } from "@/services/source";

/**
 * `sitemap.xml`. Только индексируемые публичные страницы — личный кабинет,
 * запись и вход сюда не входят (они `noindex`, `robots.ts` их тоже закрывает).
 *
 * Пусто, пока не разрешена индексация (staging/demo) или не назначен домен:
 * без домена ссылки не абсолютные, а публиковать карту сайта до реального
 * запуска незачем.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!indexingAllowed || !siteUrl) return [];

  const [services, doctors, analyses] = await Promise.all([
    dataSource.getServices(),
    dataSource.getDoctors(),
    dataSource.getAnalyses(),
  ]);

  const abs = (path: string) => `${siteUrl}${path}`;
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = (
    [
      { url: abs(routes.home), changeFrequency: "daily", priority: 1 },
      { url: abs(routes.services), changeFrequency: "daily", priority: 0.9 },
      { url: abs(routes.doctors), changeFrequency: "daily", priority: 0.9 },
      { url: abs(routes.lab), changeFrequency: "daily", priority: 0.9 },
      { url: abs(routes.labPackages), changeFrequency: "weekly", priority: 0.6 },
      { url: abs(routes.promo), changeFrequency: "weekly", priority: 0.5 },
      { url: abs(routes.about), changeFrequency: "monthly", priority: 0.4 },
      { url: abs(routes.contacts), changeFrequency: "monthly", priority: 0.4 },
      // Правовые страницы — только когда клиника передала текст: пока это заглушки с noindex.
      ...legalDocuments
        .filter((document) => document.content !== null)
        .map((document) => ({ url: abs(routes.legal(document.slug)), changeFrequency: "yearly" as const, priority: 0.2 })),
    ] satisfies Array<{ url: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }>
  ).map((entry) => ({ ...entry, lastModified: now }));

  const detailEntries: MetadataRoute.Sitemap = [
    ...services.map((service) => ({ url: abs(routes.service(service.id)), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...doctors.map((doctor) => ({ url: abs(routes.doctor(doctor.id)), lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...analyses.map((analysis) => ({ url: abs(routes.analysis(analysis.id)), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];

  return [...staticEntries, ...detailEntries];
}
