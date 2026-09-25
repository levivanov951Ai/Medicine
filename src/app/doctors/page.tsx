import type { Metadata } from "next";
import { DoctorsCatalog } from "@/components/features/doctors/DoctorsCatalog";
import { parseCatalogParams, type CatalogSearchParams } from "@/lib/catalog-params";
import { getDoctorsCatalog } from "@/services/doctors";

export const metadata: Metadata = {
  title: "Врачи",
  description: "Врачи клиники: специализация, стоимость приёма и ближайшее свободное время.",
};

interface PageProps {
  searchParams: Promise<CatalogSearchParams>;
}

/** «Врачи». Поиск и направление берутся из адреса: `?q=…&category=…`. */
export default async function DoctorsPage({ searchParams }: PageProps) {
  const [{ categories, doctors }, params] = await Promise.all([getDoctorsCatalog(), searchParams]);
  const { query, category } = parseCatalogParams(
    params,
    categories.map((item) => item.id),
  );

  return (
    <DoctorsCatalog
      key={`${query}|${category ?? ""}`}
      categories={categories}
      doctors={doctors}
      initialQuery={query}
      initialCategory={category}
    />
  );
}
