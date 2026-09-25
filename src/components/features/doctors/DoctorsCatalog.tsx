"use client";

import { useMemo } from "react";
import { CategoryFilter } from "@/components/features/catalog/CategoryFilter";
import { CatalogIntro } from "@/components/features/catalog/CatalogIntro";
import { CatalogResults } from "@/components/features/catalog/CatalogResults";
import { Container } from "@/components/layout/Container";
import { Search } from "@/components/ui/Search";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { useCatalogFilters } from "@/lib/use-catalog-filters";
import type { Category, Doctor } from "@/types/catalog";
import { DoctorCard } from "./DoctorCard";

/** Карточек за раз: три ряда по три на desktop. */
const PAGE_SIZE = 9;

const getCategoryIds = (doctor: Doctor) => doctor.categoryIds;

interface DoctorsCatalogProps {
  categories: Category[];
  doctors: Doctor[];
  initialQuery: string;
  initialCategory: string | null;
}

/** «Врачи» — Doctors-Desktop / Doctors-Mobile. Поиск по ФИО и специальности. */
export function DoctorsCatalog({ categories, doctors, initialQuery, initialCategory }: DoctorsCatalogProps) {
  // Поля поиска: ФИО, специальности и названия направлений.
  const getSearchFields = useMemo(() => {
    const labels = new Map(categories.map((category) => [category.id, category.label]));
    return (doctor: Doctor) => [
      doctor.name,
      doctor.specialty,
      ...(doctor.additionalSpecialties ?? []),
      ...doctor.categoryIds.map((id) => labels.get(id)),
    ];
  }, [categories]);

  const catalog = useCatalogFilters({
    items: doctors,
    initialQuery,
    initialCategory,
    pageSize: PAGE_SIZE,
    getCategoryIds,
    getSearchFields,
  });

  const selected = categories.find((category) => category.id === catalog.category) ?? null;
  const found = countLabel(catalog.results.length, WORDS.doctor);

  return (
    <>
      <CatalogIntro
        eyebrow="Команда"
        title="Врачи"
        lead={{
          desktop:
            "Найдите специалиста по имени или направлению — стоимость и ближайшее свободное время видны сразу на карточке.",
          mobile: "Специализация, цена и ближайшее время — сразу на карточке.",
        }}
        search={
          <Search
            action={routes.doctors}
            label="Поиск врача по ФИО или специальности"
            placeholder="ФИО или специальность"
            size="responsive"
            value={catalog.query}
            onValueChange={catalog.setQuery}
            hiddenFields={{ category: catalog.category ?? undefined }}
          />
        }
      />
      <Container className="pb-9 md:pb-[72px]">
        <div className="flex flex-col gap-5 md:gap-6 lg:flex-row lg:items-start lg:gap-12">
          <CategoryFilter
            label="Направления"
            allLabel="Все врачи"
            allCount={catalog.matchesCount}
            options={categories.map((category) => ({
              ...category,
              count: catalog.counts.get(category.id) ?? 0,
            }))}
            selected={catalog.category}
            onSelect={catalog.setCategory}
            hrefFor={(category) => routes.doctorsCatalog({ q: catalog.query.trim(), category: category ?? undefined })}
          />
          <CatalogResults
            heading={selected?.label ?? "Все врачи"}
            countLabel={found}
            announcement={`Найдено: ${found}`}
            isEmpty={catalog.results.length === 0}
            emptyTitle="Врач не найден"
            emptyHint={{
              desktop: "Проверьте написание или выберите направление слева",
              mobile: "Проверьте написание или выберите направление",
            }}
            onReset={catalog.reset}
            resetLabel="Показать всех врачей"
            hasMore={catalog.hasMore}
            onShowMore={catalog.showMore}
            moreLabel="Показать ещё врачей"
            headingGap="grid"
          >
            <ul className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {catalog.visible.map((doctor) => (
                <li key={doctor.id}>
                  <DoctorCard doctor={doctor} variant="catalog" />
                </li>
              ))}
            </ul>
          </CatalogResults>
        </div>
      </Container>
    </>
  );
}
