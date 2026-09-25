"use client";

import { CategoryFilter } from "@/components/features/catalog/CategoryFilter";
import { CatalogIntro } from "@/components/features/catalog/CatalogIntro";
import { CatalogResults } from "@/components/features/catalog/CatalogResults";
import { Container } from "@/components/layout/Container";
import { Search } from "@/components/ui/Search";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { useCatalogFilters } from "@/lib/use-catalog-filters";
import type { ServiceListItem } from "@/services/services-catalog";
import type { Category } from "@/types/catalog";
import { ServiceRow } from "./ServiceRow";

/** Строк за раз — PD-07: каталог рассчитан на 200+ услуг. */
const PAGE_SIZE = 20;

const getCategoryIds = ({ service }: ServiceListItem) => [service.categoryId];
// Название направления тоже ищется: «терапия» находит все услуги терапии (PD-23).
const getSearchFields = ({ service, categoryLabel }: ServiceListItem) => [service.title, categoryLabel];

interface ServicesCatalogProps {
  categories: Category[];
  items: ServiceListItem[];
  initialQuery: string;
  initialCategory: string | null;
}

/** «Услуги и цены» — Catalog-Desktop / Catalog-Mobile. */
export function ServicesCatalog({ categories, items, initialQuery, initialCategory }: ServicesCatalogProps) {
  const catalog = useCatalogFilters({
    items,
    initialQuery,
    initialCategory,
    pageSize: PAGE_SIZE,
    getCategoryIds,
    getSearchFields,
  });

  const selected = categories.find((category) => category.id === catalog.category) ?? null;
  const found = countLabel(catalog.results.length, WORDS.service);

  return (
    <>
      <CatalogIntro
        eyebrow="Каталог"
        title="Услуги и цены"
        lead={{
          desktop:
            "Выберите направление или найдите услугу по названию — стоимость видна сразу, запись начинается прямо здесь.",
          mobile: "Стоимость видна сразу — запись начинается прямо в списке.",
        }}
        search={
          <Search
            action={routes.services}
            label="Поиск услуги"
            placeholder="Название услуги или направления"
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
            allLabel="Все услуги"
            allCount={catalog.matchesCount}
            options={categories.map((category) => ({
              ...category,
              count: catalog.counts.get(category.id) ?? 0,
            }))}
            selected={catalog.category}
            onSelect={catalog.setCategory}
            hrefFor={(category) => routes.servicesCatalog({ q: catalog.query.trim(), category: category ?? undefined })}
          />
          <CatalogResults
            heading={selected?.label ?? "Все услуги"}
            countLabel={found}
            announcement={`Найдено: ${found}`}
            isEmpty={catalog.results.length === 0}
            emptyTitle="Ничего не найдено"
            emptyHint={{
              desktop: "Проверьте написание или выберите категорию слева",
              mobile: "Проверьте написание или выберите категорию",
            }}
            onReset={catalog.reset}
            resetLabel="Показать все услуги"
            hasMore={catalog.hasMore}
            onShowMore={catalog.showMore}
            moreLabel="Показать ещё услуги"
          >
            <ul>
              {catalog.visible.map(({ service }) => (
                <li key={service.id}>
                  <ServiceRow
                    title={service.title}
                    price={service.price}
                    detailsHref={routes.service(service.id)}
                    bookingHref={routes.bookingWithService(service.id)}
                  />
                </li>
              ))}
            </ul>
          </CatalogResults>
        </div>
      </Container>
    </>
  );
}
