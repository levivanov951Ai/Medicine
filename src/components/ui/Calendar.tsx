"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  formatDayMonthFromIso,
  isoWeekday,
  MONTHS,
  parseIsoDate,
  toIsoDate,
  WEEKDAYS_SHORT,
  type IsoDate,
} from "@/lib/dates";
import { Icon } from "./Icon";

/** available — есть свободное время; empty — нет времени; outside — прошедший день или вне записи. */
export type CalendarDayStatus = "available" | "empty" | "outside";

interface CalendarProps {
  today: IsoDate;
  /** Последний день, на который открыта запись. */
  maxDate: IsoDate;
  selected: IsoDate | null;
  statusOf: (date: IsoDate) => CalendarDayStatus;
  onSelect: (date: IsoDate) => void;
  /** Доступное имя сетки: «Выберите дату». */
  label: string;
}

const monthKey = (iso: IsoDate) => iso.slice(0, 7);

/**
 * Calendar (Booking-*.dc.html): месяц, дни с состояниями и легенда.
 * Клавиатура: Tab попадает на выбранный (или первый доступный) день,
 * стрелки двигают фокус по дням и неделям, при выходе за месяц
 * календарь сам листает. Дни без времени можно выбрать — на них
 * показывается подсказка с ближайшей датой.
 */
export function Calendar({ today, maxDate, selected, statusOf, onSelect, label }: CalendarProps) {
  const [month, setMonth] = useState(monthKey(selected ?? today));
  const [focusDate, setFocusDate] = useState<IsoDate>(selected ?? today);
  const gridRef = useRef<HTMLDivElement>(null);

  const first = parseIsoDate(`${month}-01`);
  const firstIso = toIsoDate(first);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => addDays(firstIso, index));
  const leading = isoWeekday(firstIso) - 1;

  const canPrev = month > monthKey(today);
  const canNext = month < monthKey(maxDate);
  const shiftMonth = (delta: number) => {
    const next = new Date(first.getFullYear(), first.getMonth() + delta, 1);
    setMonth(monthKey(toIsoDate(next)));
  };

  // В фокусной последовательности — один день: выбранный или первый выбираемый в месяце.
  const selectable = (date: IsoDate) => statusOf(date) !== "outside";
  const tabStop =
    days.find((date) => date === focusDate && selectable(date)) ??
    days.find((date) => date === selected) ??
    days.find(selectable);

  const moveFocus = (from: IsoDate, delta: number) => {
    let target = addDays(from, delta);
    // Пропускаем недоступные дни в ту же сторону, не выходя за границы записи.
    while (target >= today && target <= maxDate && !selectable(target)) target = addDays(target, delta > 0 ? 1 : -1);
    if (target < today || target > maxDate) return;
    setFocusDate(target);
    if (monthKey(target) !== month) setMonth(monthKey(target));
    requestAnimationFrame(() =>
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${target}"]`)?.focus(),
    );
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: IsoDate) => {
    const deltas: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const delta = deltas[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    moveFocus(date, delta);
  };

  const [year, monthIndex] = month.split("-").map(Number);

  return (
    <div className="w-full max-w-[358px]">
      <div className="mb-3.5 flex items-center justify-between">
        <MonthButton direction="prev" disabled={!canPrev} onClick={() => shiftMonth(-1)} />
        <p aria-live="polite" className="text-[16px] font-bold text-(--color-text-primary)">
          {MONTHS[monthIndex - 1]} {year}
        </p>
        <MonthButton direction="next" disabled={!canNext} onClick={() => shiftMonth(1)} />
      </div>

      <div ref={gridRef} role="group" aria-label={label} className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS_SHORT.map((weekday) => (
          <span
            key={weekday}
            aria-hidden="true"
            className="pb-1 text-center text-[12px] font-semibold text-(--color-text-secondary)"
          >
            {weekday}
          </span>
        ))}
        {Array.from({ length: leading }, (_, index) => (
          <span key={`pad-${index}`} aria-hidden="true" />
        ))}
        {days.map((date) => {
          const status = statusOf(date);
          const isSelected = date === selected;
          const isToday = date === today;
          const description =
            status === "outside"
              ? date < today
                ? "прошедшая дата"
                : "запись пока не открыта"
              : status === "empty"
                ? "свободного времени нет"
                : "есть свободное время";

          return (
            <button
              key={date}
              type="button"
              data-date={date}
              disabled={status === "outside"}
              aria-pressed={status === "outside" ? undefined : isSelected}
              aria-label={`${formatDayMonthFromIso(date)}${isToday ? ", сегодня" : ""}, ${description}`}
              tabIndex={date === tabStop ? 0 : -1}
              onKeyDown={(event) => onKeyDown(event, date)}
              onClick={() => {
                setFocusDate(date);
                onSelect(date);
              }}
              className={cn(
                "flex h-10 w-full cursor-pointer flex-col items-center justify-center rounded-[10px] text-[15px] tabular-nums md:h-[42px]",
                "disabled:cursor-default",
                status === "outside" && "text-(--color-text-disabled)",
                status === "available" &&
                  !isSelected &&
                  "border border-(--color-control-border) bg-(--color-surface-card) font-semibold text-(--color-text-primary) hover:bg-(--color-surface-hover)",
                status === "empty" &&
                  !isSelected &&
                  "border border-dashed border-(--color-border-decorative) bg-(--color-surface-card) text-(--color-step-upcoming-fg)",
                isSelected && "bg-(--color-calendar-selected-bg) font-bold text-(--color-text-on-fill)",
                isToday && !isSelected && "shadow-[inset_0_0_0_1.5px_var(--color-icon-accent)]",
              )}
            >
              {Number(date.slice(8))}
              {status === "available" && !isSelected && (
                <span aria-hidden="true" className="mt-0.5 size-1 rounded-sm bg-(--color-icon-accent)" />
              )}
            </button>
          );
        })}
      </div>

      <ul aria-hidden="true" className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12px] text-(--color-text-secondary)">
        <li className="flex items-center gap-1.5">
          <span className="size-3.5 rounded border border-(--color-control-border) bg-(--color-surface-card)" />
          Есть время
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3.5 rounded border border-dashed border-(--color-border-decorative)" />
          Нет времени
        </li>
        <li className="flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-(--color-calendar-selected-bg)" />
          Выбрано
        </li>
      </ul>
    </div>
  );
}

function MonthButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Предыдущий месяц" : "Следующий месяц"}
      className="touch-target flex size-9 cursor-pointer items-center justify-center rounded-[10px] border border-(--color-border-decorative) bg-(--color-surface-card) text-(--color-text-primary) disabled:cursor-default disabled:text-(--color-text-disabled)"
    >
      <Icon name={direction === "prev" ? "chevron-left" : "chevron-right"} size={16} />
    </button>
  );
}
