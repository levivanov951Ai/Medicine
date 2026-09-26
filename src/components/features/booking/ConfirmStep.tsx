"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatRub } from "@/lib/format";
import type { Reservation } from "@/services/booking/types";
import { SmallPrice, type SummaryItem } from "./BookingSummary";
import { StepTitle } from "./BookingFrame";
import { ReservationTimer } from "./ReservationTimer";

export interface ConfirmSection {
  title: string;
  /** «Изменить» — вернуться к шагу. */
  onEdit?: () => void;
  rows?: Array<{ label: string; value: string }>;
  items?: SummaryItem[];
}

interface ConfirmStepProps {
  reservation: Reservation;
  sections: ConfirmSection[];
  total: { label: string; amount: number };
  /** Создание записи. Ошибки (резерв истёк, время заняли) обрабатывает мастер. */
  onConfirm: () => Promise<void>;
}

/**
 * «Проверьте запись» (Booking-*: шаг «Подтверждение»): вся запись целиком
 * перед созданием, «Изменить» у каждого блока. Онлайн-оплаты нет (PD-11).
 */
export function ConfirmStep({ reservation, sections, total, onConfirm }: ConfirmStepProps) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <ReservationTimer expiresAt={reservation.expiresAt} />
      <StepTitle>Проверьте запись</StepTitle>

      <div className="rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-5 shadow-(--shadow-s) md:p-7">
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <section key={section.title} aria-label={section.title}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-[17px] font-bold text-(--color-text-primary)">{section.title}</h2>
                {section.onEdit && (
                  <button
                    type="button"
                    onClick={section.onEdit}
                    className="touch-target inline-flex cursor-pointer items-center gap-1.5 rounded-(--radius-s) text-[14px] font-semibold text-(--color-text-link-strong) hover:underline"
                  >
                    Изменить
                    <span className="sr-only">: {section.title}</span>
                    <Icon name="arrow-right" size={16} />
                  </button>
                )}
              </div>
              <dl>
                {section.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3.5 border-t border-(--color-border-decorative) py-2.5"
                  >
                    <dt className="min-w-0">
                      <span className="block text-[15px] leading-[21px] font-semibold text-(--color-text-primary)">
                        {item.title}
                      </span>
                      {item.note && (
                        <span className="mt-0.5 block text-[12px] text-(--color-text-secondary)">{item.note}</span>
                      )}
                    </dt>
                    <dd>
                      <SmallPrice price={item.price} />
                    </dd>
                  </div>
                ))}
                {section.rows?.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-6 border-t border-(--color-border-decorative) py-2.5"
                  >
                    <dt className="text-[15px] text-(--color-text-secondary)">{row.label}</dt>
                    <dd className="text-right text-[15px] font-semibold text-(--color-text-primary)">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
          <div className="flex items-baseline justify-between gap-4 border-t-[1.5px] border-(--color-border-decorative) pt-4">
            <span className="text-[17px] font-bold text-(--color-text-primary)">{total.label}</span>
            <span className="text-[22px] font-bold whitespace-nowrap text-(--color-text-primary) md:text-[26px]">
              {formatRub(total.amount)}
            </span>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        fullWidth
        loading={submitting}
        onClick={async () => {
          setSubmitting(true);
          await onConfirm();
          setSubmitting(false);
        }}
      >
        Подтвердить запись
      </Button>
      <p className="text-center text-[13px] text-(--color-text-secondary)">Оплата — в клинике, при визите.</p>
    </div>
  );
}
