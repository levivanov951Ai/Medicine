import type { Metadata } from "next";
import { AnalysesCatalog } from "@/components/features/analyses/AnalysesCatalog";
import { parseCatalogParams, type CatalogSearchParams } from "@/lib/catalog-params";
import { getAnalysesCatalog } from "@/services/analyses";

export const metadata: Metadata = {
  title: "Анализы",
  description: "Каталог анализов: стоимость, срок выполнения и подготовка. Запись на сдачу онлайн.",
};

interface PageProps {
  searchParams: Promise<CatalogSearchParams>;
}

/** «Анализы». Поиск из секции «Анализы» на главной ведёт сюда с `?q=…`. */
export default async function LabPage({ searchParams }: PageProps) {
  const [{ categories, items }, params] = await Promise.all([getAnalysesCatalog(), searchParams]);
  const { query, category } = parseCatalogParams(
    params,
    categories.map((item) => item.id),
  );

  return (
    <AnalysesCatalog
      key={`${query}|${category ?? ""}`}
      categories={categories}
      items={items}
      initialQuery={query}
      initialCategory={category}
    />
  );
}
