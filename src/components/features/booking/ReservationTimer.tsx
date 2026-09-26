"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface ReservationTimerProps {
  expiresAt: number;
  /** С подсказкой «Успейте подтвердить запись…» (шаг «Дата и время»). */
  withHint?: boolean;
  className?: string;
}

const format = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
};

/**
 * Reservation Timer (PD-02): «Время зарезервировано на 04:59».
 * Цифры обновляются каждую секунду визуально, но скринридеру не
 * объявляются — иначе он говорил бы без остановки. Вслух сообщается
 * только «осталась 1 минута». Истечение резерва обрабатывает мастер
 * записи: он возвращает к выбору времени и показывает сообщение.
 */
export function ReservationTimer({ expiresAt, withHint = false, className }: ReservationTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const left = expiresAt - now;
  const lastMinute = left > 0 && left <= 60_000;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-[14px] border border-(--color-border-accent) bg-(--color-surface-accent) px-3.5 py-2.5",
        withHint && "md:px-4 md:py-3",
        className,
      )}
    >
      <span className="flex shrink-0 text-(--color-icon-strong)">
        <Icon name="clock" size={18} />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <p role="timer" aria-live="off" className="text-[14px] text-(--color-text-primary)">
          Время зарезервировано на <b className="tabular-nums">{format(left)}</b>
        </p>
        {withHint && (
          <p className="text-[12px] text-(--color-text-secondary)">
            Успейте подтвердить запись — потом слот освободится
          </p>
        )}
      </div>
      <span aria-live="polite" className="sr-only">
        {lastMinute ? "До конца резерва осталась 1 минута" : ""}
      </span>
    </div>
  );
}
