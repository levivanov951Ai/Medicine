"use client";

import { ServiceRow } from "@/components/features/services/ServiceRow";
import { ChipToggle } from "@/components/ui/Chip";
import { Search } from "@/components/ui/Search";
import { EmptyState } from "@/components/ui/StateBlocks";
import { Button } from "@/components/ui/Button";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { useCatalogFilters } from "@/lib/use-catalog-filters";
import type { Category, Price } from "@/types/catalog";
import { StepTitle } from "./BookingFrame";

export interface PickableService {
  id: string;
  title: string;
  categoryId: string;
  categoryLabel: string;
  /** Цена в каталоге или у выбранного врача. */
  price: Price;
}

interface ServicePickStepProps {
  services: PickableService[];
  categories: Category[];
  /** Врач уже выбран — показываем только его услуги. */
  doctorName?: string;
  onSelect: (serviceId: string) => void;
}

const PAGE_SIZE = 20;
const getCategoryIds = (item: PickableService) => [item.categoryId];
const getSearchFields = (item: PickableService) => [item.title, item.categoryLabel];

/**
 * Шаг «Услуга» (Booking-Doctor-*, шаг 1): поиск, направления и строки
 * из утверждённого каталога услуг. Если врач уже выбран — только его услуги
 * с его ценами.
 */
export function ServicePickStep({ services, categories, doctorName, onSelect }: ServicePickStepProps) {
  const catalog = useCatalogFilters({
    items: services,
    initialQuery: "",
    initialCategory: null,
    pageSize: PAGE_SIZE,
    getCategoryIds,
    getSearchFields,
  });
  const used = categories.filter((category) => services.some((service) => service.categoryId === category.id));
  const selected = used.find((category) => category.id === catalog.category);
  const found = countLabel(catalog.results.length, WORDS.service);

  return (
    <div className="flex max-w-[900px] flex-col">
      <StepTitle
        lead={
          doctorName
            ? `Услуги, которые проводит ${doctorName}. После выбора сразу перейдём к дате и времени.`
            : "Найдите по названию или выберите направление — после выбора сразу перейдём к врачам."
        }
      >
        Выберите услугу
      </StepTitle>

      {services.length > 5 && (
        <div className="mt-3.5 md:mt-6 md:max-w-[640px]">
          <Search
            action={routes.booking}
            label="Поиск услуги"
            placeholder="Название услуги или направления"
            size="responsive"
            value={catalog.query}
            onValueChange={catalog.setQuery}
          />
        </div>
      )}

      {used.length > 1 && (
        <div role="group" aria-label="Направления" className="mt-3 md:mt-5">
          <ul className="scroll-row -mx-4 gap-2 px-4 pt-1 pb-1 md:mx-0 md:flex-wrap md:gap-2.5 md:overflow-visible md:p-0">
            {used.map((category) => (
              <li key={category.id} className="shrink-0">
                <ChipToggle
                  pressed={catalog.category === category.id}
                  icon={category.icon}
                  onClick={() => catalog.setCategory(catalog.category === category.id ? null : category.id)}
                >
                  {category.label}
                </ChipToggle>
              </li>
            ))}
          </ul>
        </div>
      )}

      <section aria-labelledby="pick-service-title" className="mt-2.5 md:mt-6">
        <div className="mb-1.5 flex items-baseline justify-between gap-4">
          <h2 id="pick-service-title" className="text-[18px] font-bold text-(--color-text-primary) md:text-[20px]">
            {selected?.label ?? (doctorName ? "Услуги врача" : "Все услуги")}
          </h2>
          <p className="text-[13px] text-(--color-text-secondary) md:text-[14px]">{found}</p>
        </div>
        <p aria-live="polite" className="sr-only">
          Найдено: {found}
        </p>
        {catalog.results.length === 0 ? (
          <div className="rounded-[14px] border border-(--color-border-decorative) px-4 py-6">
            <EmptyState
              title="Ничего не найдено"
              titleAs="h3"
              description="Проверьте написание или выберите другое направление"
              action={
                <Button variant="secondary" size="sm" onClick={catalog.reset}>
                  Показать все услуги
                </Button>
              }
            />
          </div>
        ) : (
          <ul>
            {catalog.visible.map((service) => (
              <li key={service.id}>
                <ServiceRow title={service.title} price={service.price} onSelect={() => onSelect(service.id)} />
              </li>
            ))}
          </ul>
        )}
        {catalog.hasMore && (
          <div className="mt-5 flex justify-center">
            <Button variant="secondary" size="md" onClick={catalog.showMore} className="w-full md:w-auto">
              Показать ещё услуги
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
