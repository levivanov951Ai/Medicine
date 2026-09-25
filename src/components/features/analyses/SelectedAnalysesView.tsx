"use client";

import Link from "next/link";
import { useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { EmptyState, LoadingState } from "@/components/ui/StateBlocks";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { selectedAnalyses, useIsHydrated } from "@/lib/selected-analyses";
import type { AnalysisListItem } from "@/services/analyses";
import { useSelection } from "./use-selection";

const SUMMARY_CTA_ID = "selected-analyses-booking";
const PAYMENT_NOTE = "Оплата — в клинике, при визите.";

interface SelectedAnalysesViewProps {
  catalog: AnalysisListItem[];
}

/**
 * «Выбранные анализы» — SelectedAnalyses-Desktop / SelectedAnalyses-Mobile.
 * Список, подготовка к каждому анализу, удаление, итог и переход к записи.
 * Оплаты онлайн нет (PD-11) — только сумма.
 */
export function SelectedAnalysesView({ catalog }: SelectedAnalysesViewProps) {
  const hydrated = useIsHydrated();
  const { items, count, total } = useSelection(catalog);
  const countRef = useRef<HTMLParagraphElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const inList = `${countLabel(count, WORDS.analysis)} в списке`;

  const remove = (id: string) => {
    selectedAnalyses.remove(id);
    // Строка исчезает вместе с кнопкой — возвращаем фокус к счётчику списка
    // или, если список опустел, к пустому состоянию.
    requestAnimationFrame(() => (countRef.current ?? emptyRef.current)?.focus());
  };

  // До гидратации сохранённый выбор ещё не прочитан — не показываем «пусто» раньше времени.
  if (!hydrated) {
    return <LoadingState label="Загружаем выбранные анализы" className="max-w-[760px]" />;
  }

  if (count === 0) {
    return (
      <div
        ref={emptyRef}
        tabIndex={-1}
        className="max-w-[480px] rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-5 py-8 shadow-(--shadow-s) outline-none md:px-8 md:py-12"
      >
      <EmptyState
        title="Пока нет выбранных анализов"
        titleAs="h2"
        icon="flask"
        description="Добавьте исследования из каталога — они появятся здесь перед записью."
        action={
          <Button href={routes.lab} size="md">
            Выбрать анализы
          </Button>
        }
      />
      </div>
    );
  }

  return (
    <div className="lg:flex lg:items-start lg:gap-10">
      <section aria-labelledby="selected-list-title" className="min-w-0 flex-1">
        <h2 id="selected-list-title" className="sr-only">
          Список выбранных анализов
        </h2>
        <p
          ref={countRef}
          tabIndex={-1}
          aria-live="polite"
          className="mb-5 text-[15px] leading-[22px] text-(--color-text-secondary) outline-none md:mb-4 md:text-[14px] md:leading-normal"
        >
          {inList}
        </p>
        <ul className="flex flex-col gap-3 md:gap-3.5">
          {items.map(({ analysis, categoryLabel }) => (
            <li key={analysis.id}>
              <SelectedAnalysisRow
                id={analysis.id}
                title={analysis.title}
                categoryLabel={categoryLabel}
                preparation={analysis.preparation}
                price={analysis.price}
                onRemove={remove}
              />
            </li>
          ))}
        </ul>
        <Link
          href={routes.lab}
          className="touch-target mt-4 inline-flex items-center gap-1.5 rounded-(--radius-s) py-2 text-[15px] font-semibold text-(--color-text-link-strong) hover:underline md:mt-3.5"
        >
          Добавить ещё анализы
          <Icon name="chevron-right" size={16} />
        </Link>
      </section>

      <aside
        aria-labelledby="selected-summary-title"
        className="mt-5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-5 shadow-(--shadow-s) md:p-7 lg:sticky lg:top-[104px] lg:mt-0 lg:w-[380px] lg:shrink-0"
      >
        <h2 id="selected-summary-title" className="sr-only text-[18px] font-bold text-(--color-text-primary) md:not-sr-only">
          Итого
        </h2>
        <ul className="hidden flex-col gap-2.5 md:mt-[18px] md:flex">
          {items.map(({ analysis }) => (
            <li key={analysis.id} className="flex items-center justify-between gap-4 text-[14px] text-(--color-text-secondary)">
              <span className="truncate">{analysis.title}</span>
              <span className="shrink-0 font-semibold text-(--color-text-primary)">{formatRub(analysis.price.amount)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-4 md:mt-[18px] md:border-t md:border-(--color-border-decorative) md:pt-[18px]">
          <span className="text-[15px] font-semibold text-(--color-text-primary) md:text-[16px]">
            {countLabel(count, WORDS.analysis)}
          </span>
          <span className="text-[22px] font-bold text-(--color-text-primary) md:text-[24px]">
            <span className="sr-only">на сумму </span>
            {formatRub(total)}
          </span>
        </div>
        <div id={SUMMARY_CTA_ID} className="mt-3.5 md:mt-[18px]">
          <Button href={routes.bookingLab} size="md" fullWidth className="md:h-[52px] md:text-[18px]">
            Выбрать дату и время
          </Button>
        </div>
        <p className="mt-3.5 text-[12px] leading-[18px] text-(--color-text-secondary) md:mt-[18px] md:text-[13px] md:leading-[19px]">
          {PAYMENT_NOTE}
          <span className="hidden md:inline"> Онлайн-оплата не предусмотрена.</span>
        </p>
      </aside>

      <StickyActionBar
        className="-mx-4"
        watchId={SUMMARY_CTA_ID}
        title={countLabel(count, WORDS.analysis)}
        subtitle={formatRub(total)}
        action={
          <Button href={routes.bookingLab} size="md">
            Выбрать дату и время
          </Button>
        }
      />
    </div>
  );
}

interface SelectedAnalysisRowProps {
  id: string;
  title: string;
  categoryLabel: string;
  preparation: string;
  price: AnalysisListItem["analysis"]["price"];
  onRemove: (id: string) => void;
}

/**
 * Selected Analysis Row (handoff, раздел 5): иконка, название, раздел и подготовка,
 * цена, «Убрать». На desktop и mobile одинаковая по составу.
 */
function SelectedAnalysisRow({ id, title, categoryLabel, preparation, price, onRemove }: SelectedAnalysisRowProps) {
  const hasDiscount = price.oldAmount !== undefined;

  return (
    <article className="flex items-start gap-3 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-3.5 md:items-center md:gap-[18px] md:p-5">
      <span className="mt-0.5 flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg) md:mt-0 md:size-11 md:rounded-(--radius-m)">
        <Icon name="flask" size={20} className="size-[17px] md:size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:flex-row md:items-center md:gap-[18px]">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <h3 className="text-[15px] leading-5 font-semibold break-words text-(--color-text-primary) md:text-[16px] md:leading-[22px]">
            <Link href={routes.analysis(id)} className="rounded-(--radius-s) hover:underline">
              {title}
            </Link>
          </h3>
          {/* Mobile — одна строка текста с переносом; desktop — с иконкой подготовки */}
          <p className="text-[12px] text-(--color-text-secondary) md:flex md:flex-wrap md:items-center md:gap-x-2.5 md:text-[13px]">
            <span>{categoryLabel}</span>
            <span aria-hidden="true" className="mx-1.5 text-(--color-icon-muted) md:mx-0">
              ·
            </span>
            <span className="md:inline-flex md:items-center md:gap-[5px]">
              <span className="hidden md:flex">
                <Icon name="file-text" size={13} />
              </span>
              <span className="sr-only">Подготовка: </span>
              {preparation}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 md:shrink-0">
          <Price price={price} size="row" />
          {hasDiscount && <Badge tone="promo">Акция</Badge>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="touch-target -mr-1 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-[10px] text-(--color-icon-muted) transition-colors hover:bg-(--color-surface-page) hover:text-(--color-text-secondary) md:mr-0 md:size-10 md:rounded-(--radius-m)"
      >
        <Icon name="trash" size={18} className="size-[17px] md:size-[18px]" />
        <span className="sr-only">Убрать из выбранных: {title}</span>
      </button>
    </article>
  );
}
