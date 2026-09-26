"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/routes";

interface BookingSuccessProps {
  /** «Запись подтверждена. Ждём вас 24 сентября в 11:00.» */
  message: string;
  rows: Array<{ label: string; value: string }>;
}

/**
 * «Вы записаны» — запись создана сразу, без ожидания звонка (FACT 2.4).
 * Запрещённых формулировок («заявка», «перезвоним», «ожидайте») здесь нет.
 */
export function BookingSuccess({ message, rows }: BookingSuccessProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Экран сменился целиком — переводим фокус на заголовок, чтобы его прочитали.
  useEffect(() => titleRef.current?.focus(), []);

  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center gap-3.5 pt-4 text-center md:gap-4 md:pt-10">
      <span className="flex size-16 items-center justify-center rounded-(--radius-pill) bg-(--color-surface-success) text-(--color-text-success) md:size-20">
        <Icon name="check" size={40} className="size-8 md:size-10" />
      </span>
      <h1
        ref={titleRef}
        tabIndex={-1}
        className="mt-2 text-[30px] leading-[38px] font-bold text-(--color-text-primary) outline-none md:text-[40px] md:leading-[48px]"
      >
        Вы записаны
      </h1>
      <p className="text-[16px] leading-6 text-(--color-text-secondary) md:text-[18px] md:leading-7">{message}</p>

      <dl className="mt-3 w-full rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-5 pt-2 pb-4 text-left shadow-(--shadow-s) md:px-7">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={
              index === 0
                ? "flex justify-between gap-6 py-3"
                : "flex justify-between gap-6 border-t border-(--color-border-decorative) py-3"
            }
          >
            <dt className="text-[15px] text-(--color-text-secondary)">{row.label}</dt>
            <dd className="text-right text-[15px] font-semibold text-(--color-text-primary)">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex w-full flex-col gap-3 md:w-auto md:flex-row md:gap-3.5">
        <Button href={routes.account} size="md" className="md:h-[52px] md:px-6 md:text-[18px]">
          Перейти в личный кабинет
        </Button>
        <Button href={routes.home} variant="secondary" size="md" className="md:h-[52px] md:px-6 md:text-[18px]">
          На главную
        </Button>
      </div>
    </div>
  );
}
