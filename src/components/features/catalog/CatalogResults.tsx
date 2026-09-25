import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateBlocks";

interface CatalogResultsProps {
  /** Заголовок списка: выбранное направление или «Все услуги». */
  heading: string;
  /** «42 услуги». */
  countLabel: string;
  /** Сообщение для скринридера после изменения фильтров. */
  announcement: string;
  isEmpty: boolean;
  /** Что предложить, если ничего не найдено. */
  emptyHint: { desktop: string; mobile: string };
  emptyTitle: string;
  onReset: () => void;
  resetLabel: string;
  hasMore: boolean;
  onShowMore: () => void;
  moreLabel: string;
  /** Отступ под заголовком: у списков-строк меньше, чем у сетки карточек. */
  headingGap?: "list" | "grid";
  children: ReactNode;
}

/**
 * Правая часть каталога: заголовок с количеством, список, «Показать ещё»
 * и состояние «Ничего не найдено» (общее для всех каталогов — handoff, раздел 6).
 */
export function CatalogResults({
  heading,
  countLabel,
  announcement,
  isEmpty,
  emptyHint,
  emptyTitle,
  onReset,
  resetLabel,
  hasMore,
  onShowMore,
  moreLabel,
  headingGap = "list",
  children,
}: CatalogResultsProps) {
  return (
    <section aria-labelledby="catalog-results-title" className="flex min-w-0 flex-1 flex-col">
      <div
        className={
          headingGap === "grid"
            ? "mb-4 flex items-baseline justify-between gap-4 md:mb-5"
            : "mb-1 flex items-baseline justify-between gap-4 md:mb-2"
        }
      >
        <h2
          id="catalog-results-title"
          className="text-[22px] leading-7 font-bold text-(--color-text-primary) md:text-[24px] md:leading-8"
        >
          {heading}
        </h2>
        <p className="shrink-0 text-[13px] text-(--color-text-secondary) md:text-[14px]">{countLabel}</p>
      </div>
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {isEmpty ? (
        <div className="mt-3 rounded-[14px] border border-(--color-border-decorative) px-4 py-6">
        <EmptyState
          title={emptyTitle}
          titleAs="h3"
          description={
            <>
              <span className="lg:hidden">{emptyHint.mobile}</span>
              <span className="hidden lg:inline">{emptyHint.desktop}</span>
            </>
          }
          action={
            <Button variant="secondary" size="sm" onClick={onReset}>
              {resetLabel}
            </Button>
          }
        />
        </div>
      ) : (
        children
      )}

      {!isEmpty && hasMore && (
        <div className="mt-5 flex justify-center md:mt-7">
          <Button variant="secondary" size="md" onClick={onShowMore} className="w-full md:w-auto">
            {moreLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
