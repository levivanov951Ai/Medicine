import type { Metadata } from "next";
import { ServicesCatalog } from "@/components/features/services/ServicesCatalog";
import { parseCatalogParams, type CatalogSearchParams } from "@/lib/catalog-params";
import { getServicesCatalog } from "@/services/services-catalog";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description: "Каталог услуг клиники с ценами. Запись онлайн прямо из списка.",
};

interface PageProps {
  searchParams: Promise<CatalogSearchParams>;
}

/**
 * «Услуги и цены». Параметры адреса применяются сразу при открытии:
 * поиск с главной ведёт сюда с `?q=…` (PD-23), быстрые ссылки — с `?category=…`.
 */
export default async function ServicesPage({ searchParams }: PageProps) {
  const [{ categories, items }, params] = await Promise.all([getServicesCatalog(), searchParams]);
  const { query, category } = parseCatalogParams(
    params,
    categories.map((item) => item.id),
  );

  return (
    <ServicesCatalog
      // Новый адрес (переход по ссылке) — новое состояние фильтров.
      key={`${query}|${category ?? ""}`}
      categories={categories}
      items={items}
      initialQuery={query}
      initialCategory={category}
    />
  );
}
