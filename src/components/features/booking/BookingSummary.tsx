import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { formatRub } from "@/lib/format";
import type { Price as PriceValue } from "@/types/catalog";

/** Позиция записи: услуга или анализ с ценой. */
export interface SummaryItem {
  id: string;
  title: string;
  price: PriceValue;
  /** Подпись под названием: подготовка к анализу. */
  note?: string;
}

interface BookingSummaryProps {
  /** Ссылка «Изменить состав» (запись на анализы). */
  editHref?: string;
  editLabel?: string;
  /** Поля «Услуга», «Врач», «Дата и время». */
  fields?: Array<{ label: string; value: string | null }>;
  /** Позиции со своей ценой — список анализов. */
  items?: SummaryItem[];
  total: { label: string; amount: number };
  /** Таймер резерва и другое содержимое под итогом. */
  footer?: ReactNode;
}

/**
 * «Ваша запись» — карточка справа на шагах записи (Booking-*.dc.html).
 * Показывает уже выбранное: пациент видит, на что записывается, на каждом шаге.
 * Оплата — только в клинике (PD-11).
 */
export function BookingSummary({ editHref, editLabel, fields = [], items = [], total, footer }: BookingSummaryProps) {
  return (
    <aside
      aria-labelledby="booking-summary-title"
      className="rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-5 shadow-(--shadow-s) md:p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="booking-summary-title" className="text-[18px] font-bold text-(--color-text-primary)">
            Ваша запись
          </h2>
          {editHref && (
            <Link
              href={editHref}
              className="touch-target inline-flex items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline"
            >
              {editLabel}
              <Icon name="arrow-right" size={16} />
            </Link>
          )}
        </div>

        {items.length > 0 && (
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3.5 border-t border-(--color-border-decorative) py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-[14px] leading-5 font-semibold text-(--color-text-primary)">{item.title}</p>
                  {item.note && <p className="mt-0.5 text-[12px] text-(--color-text-secondary)">{item.note}</p>}
                </div>
                <SmallPrice price={item.price} />
              </li>
            ))}
          </ul>
        )}

        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-[3px]">
            <span className="text-[13px] text-(--color-text-secondary)">{field.label}</span>
            <span className="text-[15px] leading-[21px] font-semibold text-(--color-text-primary)">
              {field.value ?? "—"}
            </span>
          </div>
        ))}

        <div className="flex items-baseline justify-between gap-3 border-t border-(--color-border-decorative) pt-3">
          <span className="text-[15px] font-semibold text-(--color-text-primary)">{total.label}</span>
          <span className="text-[22px] font-bold whitespace-nowrap text-(--color-text-primary)">
            {formatRub(total.amount)}
          </span>
        </div>
        <p className="text-[13px] text-(--color-text-secondary)">Оплата — в клинике, при визите.</p>
        {footer}
      </div>
    </aside>
  );
}

/** Цена позиции в сводке: 14px, при скидке — со старой ценой. */
export function SmallPrice({ price }: { price: PriceValue }) {
  if (price.oldAmount === undefined) {
    return (
      <span className="text-[14px] font-bold whitespace-nowrap text-(--color-text-primary)">
        {price.isFrom && "от "}
        {formatRub(price.amount)}
      </span>
    );
  }
  return <Price price={price} size="xs" className="shrink-0" />;
}
