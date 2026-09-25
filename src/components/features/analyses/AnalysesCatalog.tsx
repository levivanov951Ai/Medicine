"use client";

import { CategoryFilter } from "@/components/features/catalog/CategoryFilter";
import { CatalogIntro } from "@/components/features/catalog/CatalogIntro";
import { CatalogResults } from "@/components/features/catalog/CatalogResults";
import { Container } from "@/components/layout/Container";
import { Search } from "@/components/ui/Search";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { useCatalogFilters } from "@/lib/use-catalog-filters";
import type { AnalysisListItem } from "@/services/analyses";
import type { Category } from "@/types/catalog";
import { AnalysisRow } from "./AnalysisRow";

const PAGE_SIZE = 20;

const getCategoryIds = ({ analysis }: AnalysisListItem) => [analysis.categoryId];
const getSearchFields = ({ analysis, categoryLabel }: AnalysisListItem) => [analysis.title, categoryLabel];

interface AnalysesCatalogProps {
  categories: Category[];
  items: AnalysisListItem[];
  initialQuery: string;
  initialCategory: string | null;
}

/** «Анализы» — Analyses-Desktop / Analyses-Mobile. Множественный выбор — PD-04. */
export function AnalysesCatalog({ categories, items, initialQuery, initialCategory }: AnalysesCatalogProps) {
  const catalog = useCatalogFilters({
    items,
    initialQuery,
    initialCategory,
    pageSize: PAGE_SIZE,
    getCategoryIds,
    getSearchFields,
  });

  const selected = categories.find((category) => category.id === catalog.category) ?? null;
  const found = countLabel(catalog.results.length, WORDS.study);

  return (
    <>
      <CatalogIntro
        eyebrow="Лаборатория"
        title="Анализы"
        lead={{
          desktop:
            "Найдите исследование по названию — стоимость, срок и подготовка видны сразу в списке, без перехода на отдельную страницу.",
          mobile: "Цена, срок и подготовка — сразу в списке, без лишнего перехода.",
        }}
        search={
          <Search
            action={routes.lab}
            label="Поиск анализа"
            placeholder="Название анализа или исследования"
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
            label="Разделы лаборатории"
            allLabel="Все анализы"
            allCount={catalog.matchesCount}
            options={categories.map((category) => ({
              ...category,
              count: catalog.counts.get(category.id) ?? 0,
            }))}
            selected={catalog.category}
            onSelect={catalog.setCategory}
            hrefFor={(category) => routes.labCatalog({ q: catalog.query.trim(), category: category ?? undefined })}
          />
          <CatalogResults
            heading={selected?.label ?? "Все анализы"}
            countLabel={found}
            announcement={`Найдено: ${found}`}
            isEmpty={catalog.results.length === 0}
            emptyTitle="Ничего не найдено"
            emptyHint={{
              desktop: "Проверьте написание или выберите категорию слева",
              mobile: "Проверьте написание или выберите категорию",
            }}
            onReset={catalog.reset}
            resetLabel="Показать все анализы"
            hasMore={catalog.hasMore}
            onShowMore={catalog.showMore}
            moreLabel="Показать ещё исследования"
          >
            <ul>
              {catalog.visible.map(({ analysis }) => (
                <li key={analysis.id}>
                  <AnalysisRow analysis={analysis} variant="catalog" />
                </li>
              ))}
            </ul>
          </CatalogResults>
        </div>
      </Container>
    </>
  );
}
