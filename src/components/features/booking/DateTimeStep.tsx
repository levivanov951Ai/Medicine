"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Calendar, type CalendarDayStatus } from "@/components/ui/Calendar";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, Notice } from "@/components/ui/StateBlocks";
import { TimeSlot } from "@/components/ui/TimeSlot";
import { addDays, formatDayMonthFromIso, formatLongDate, minutesOf, toIsoDate, type IsoDate } from "@/lib/dates";
import { bookingService } from "@/services/booking";
import type { BookingTarget, DayAvailability, Reservation, SlotRef } from "@/services/booking/types";
import type { BookingNotice } from "@/lib/booking-draft";
import { ReservationTimer } from "./ReservationTimer";
import { StepTitle } from "./BookingFrame";

type Load = { status: "loading" } | { status: "error" } | { status: "ready"; days: DayAvailability[] };

interface DateTimeStepProps {
  target: BookingTarget;
  /** Контекст над календарём: подготовка к анализам, выбранный врач (mobile). */
  intro?: ReactNode;
  reservation: Reservation | null;
  /** Время со страницы врача — выбирается автоматически, если ещё свободно. */
  requestedSlot?: SlotRef | null;
  onRequestedSlotHandled: (result: "reserved" | "unavailable") => void;
  notice?: BookingNotice;
  onDismissNotice: () => void;
  /** Резерв выбранного слота. Возвращает, удалось ли. */
  onReserve: (slot: SlotRef) => Promise<boolean>;
  onContinue: () => void;
}

const periods = [
  { label: "Утро", from: 0, to: 12 * 60 },
  { label: "День", from: 12 * 60, to: 17 * 60 },
  { label: "Вечер", from: 17 * 60, to: 24 * 60 },
];

/**
 * «Дата и время» — один экран (PD-03), общий для записи к врачу и на анализы.
 * Календарь → свободное время → резерв на 5 минут (PD-02) → «Продолжить».
 * Состояния: загрузка, ошибка загрузки, нет времени на дату, время только
 * что заняли, резерв истёк. Данные — только через bookingService.
 */
export function DateTimeStep({
  target,
  intro,
  reservation,
  requestedSlot,
  onRequestedSlotHandled,
  notice,
  onDismissNotice,
  onReserve,
  onContinue,
}: DateTimeStepProps) {
  const [today] = useState(() => toIsoDate(new Date()));
  const maxDate = addDays(today, bookingService.horizonDays - 1);
  const [load, setLoad] = useState<Load>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [pickedDate, setPickedDate] = useState<IsoDate | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  // Слоты, которые оказались заняты при попытке резерва, — показываем занятыми сразу.
  const [takenNow, setTakenNow] = useState<Set<string>>(() => new Set());
  const requestHandled = useRef(false);
  const targetKey = target.kind === "lab" ? "lab" : `${target.doctorId}:${target.serviceId}`;

  useEffect(() => {
    let cancelled = false;
    bookingService
      .getAvailability(target, today, bookingService.horizonDays)
      .then((days) => !cancelled && setLoad({ status: "ready", days }))
      .catch(() => !cancelled && setLoad({ status: "error" }));
    return () => {
      cancelled = true;
    };
    // target описывается ключом, чтобы не перезагружать расписание на каждый рендер
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetKey, today, attempt]);

  const days = useMemo(() => (load.status === "ready" ? load.days : []), [load]);
  const isFree = useCallback(
    (slot: { time: string; available: boolean }, date: IsoDate) =>
      slot.available && !takenNow.has(`${date}|${slot.time}`),
    [takenNow],
  );
  const dayMap = useMemo(() => new Map(days.map((day) => [day.date, day])), [days]);
  const hasFree = useCallback(
    (date: IsoDate) => dayMap.get(date)?.slots.some((slot) => isFree(slot, date)) ?? false,
    [dayMap, isFree],
  );
  const firstFreeDate = days.find((day) => hasFree(day.date))?.date ?? null;

  const selectedDate = pickedDate ?? reservation?.slot.date ?? requestedSlot?.date ?? firstFreeDate;
  const selectedDay = selectedDate ? dayMap.get(selectedDate) : undefined;

  // Быстрый слот со страницы врача: резервируем сразу, если он ещё свободен.
  useEffect(() => {
    if (load.status !== "ready" || !requestedSlot || requestHandled.current || reservation) return;
    requestHandled.current = true;
    const slot = dayMap.get(requestedSlot.date)?.slots.find((item) => item.time === requestedSlot.time);
    if (!slot || !isFree(slot, requestedSlot.date)) {
      onRequestedSlotHandled("unavailable");
      return;
    }
    onReserve(requestedSlot).then((ok) => onRequestedSlotHandled(ok ? "reserved" : "unavailable"));
  }, [load.status, requestedSlot, reservation, dayMap, isFree, onReserve, onRequestedSlotHandled]);

  const choose = async (date: IsoDate, time: string) => {
    if (pending) return;
    if (reservation?.slot.date === date && reservation.slot.time === time) return;
    onDismissNotice();
    setPending(time);
    const ok = await onReserve({ date, time });
    setPending(null);
    if (!ok) setTakenNow((current) => new Set(current).add(`${date}|${time}`));
  };

  const statusOf = (date: IsoDate): CalendarDayStatus => {
    if (date < today || date > maxDate) return "outside";
    return hasFree(date) ? "available" : "empty";
  };

  const nearestFree = selectedDate
    ? days.find((day) => day.date > selectedDate && hasFree(day.date))?.date ?? null
    : null;

  const noticeBlock = renderNotice(notice, reservation, onDismissNotice);

  return (
    <div className="flex flex-col gap-4 md:gap-5">
      <StepTitle>Выберите дату и время</StepTitle>
      {intro}
      {noticeBlock}

      {load.status === "loading" && <AvailabilityLoading />}

      {load.status === "error" && (
        <div className="rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-4 py-8">
          <EmptyState
            icon="calendar"
            titleAs="h2"
            title="Не удалось загрузить расписание"
            description="Проверьте интернет и попробуйте ещё раз — выбранные данные сохранены."
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setLoad({ status: "loading" });
                  setAttempt((value) => value + 1);
                }}
              >
                Обновить
              </Button>
            }
          />
        </div>
      )}

      {load.status === "ready" && !firstFreeDate && (
        <div className="rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-4 py-8">
          <EmptyState
            icon="calendar"
            titleAs="h2"
            title="Свободного времени пока нет"
            description="Запись открыта на месяц вперёд — все слоты уже заняты. Загляните позже или выберите другого специалиста."
          />
        </div>
      )}

      {load.status === "ready" && firstFreeDate && (
        <div className="flex flex-col gap-5 md:rounded-(--radius-l) md:border md:border-(--color-border-decorative) md:bg-(--color-surface-card) md:p-6 md:shadow-(--shadow-s) xl:flex-row xl:items-start xl:gap-7">
          <div className="shrink-0">
            <Calendar
              today={today}
              maxDate={maxDate}
              selected={selectedDate}
              statusOf={statusOf}
              label="Дата приёма"
              onSelect={(date) => {
                setPickedDate(date);
                onDismissNotice();
              }}
            />
          </div>
          <div aria-hidden="true" className="h-px bg-(--color-border-decorative) xl:h-auto xl:w-px xl:self-stretch" />
          <section aria-labelledby="slots-title" className="flex min-w-0 flex-1 flex-col gap-4">
            <h2 id="slots-title" className="text-[16px] font-bold text-(--color-text-primary)">
              Время · {selectedDate ? formatLongDate(selectedDate) : ""}
            </h2>
            {selectedDay && selectedDay.slots.some((slot) => isFree(slot, selectedDay.date)) ? (
              <>
                {periods.map((period) => {
                  const slots = selectedDay.slots.filter(
                    (slot) => minutesOf(slot.time) >= period.from && minutesOf(slot.time) < period.to,
                  );
                  if (slots.length === 0) return null;
                  return (
                    <div key={period.label} className="flex flex-col gap-2.5">
                      <h3 className="text-[13px] font-bold text-(--color-text-secondary)">{period.label}</h3>
                      <ul className="flex flex-wrap gap-2">
                        {slots.map((slot) => {
                          const isSelected =
                            reservation?.slot.date === selectedDay.date && reservation.slot.time === slot.time;
                          return (
                            <li key={slot.time}>
                              <TimeSlot
                                time={slot.time}
                                dateLabel={formatDayMonthFromIso(selectedDay.date)}
                                state={
                                  isSelected
                                    ? "selected"
                                    : pending === slot.time
                                      ? "pending"
                                      : isFree(slot, selectedDay.date)
                                        ? "free"
                                        : "busy"
                                }
                                onSelect={() => choose(selectedDay.date, slot.time)}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
                <SlotLegend />
              </>
            ) : (
              <Notice
                tone="info"
                icon="calendar"
                role="status"
                title={`На ${selectedDate ? formatDayMonthFromIso(selectedDate) : "эту дату"} свободного времени нет`}
                description={
                  nearestFree
                    ? `Ближайшая дата со свободным временем — ${formatDayMonthFromIso(nearestFree)}.`
                    : "Выберите другую дату в календаре."
                }
                action={
                  nearestFree && (
                    <Button variant="secondary" size="sm" onClick={() => setPickedDate(nearestFree)}>
                      Показать {formatDayMonthFromIso(nearestFree)}
                    </Button>
                  )
                }
              />
            )}
          </section>
        </div>
      )}

      {reservation && (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-5">
          <ReservationTimer expiresAt={reservation.expiresAt} withHint className="md:flex-1" />
          {/* На mobile «Продолжить» — в закреплённой панели внизу экрана */}
          <div className="hidden lg:block">
            <Button size="lg" onClick={onContinue}>
              Продолжить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderNotice(notice: BookingNotice | undefined, reservation: Reservation | null, onDismiss: () => void) {
  if (notice === "expired") {
    return (
      <Notice
        tone="warning"
        icon="clock"
        role="alert"
        title="Время больше недоступно. Выберите другое время"
        description="Резерв действует 5 минут. Всё остальное сохранено — нужно только выбрать время заново."
        action={
          <Button variant="secondary" size="sm" onClick={onDismiss}>
            Выбрать другое время
          </Button>
        }
      />
    );
  }
  if ((notice === "slot-unavailable" || notice === "requested-slot-unavailable") && !reservation) {
    return (
      <Notice
        tone="warning"
        icon="alert"
        role="alert"
        title="Это время только что заняли"
        description="Пока вы выбирали, слот успели забронировать. Выберите другое время — свободные показаны ниже."
      />
    );
  }
  return null;
}

function AvailabilityLoading() {
  return (
    <div
      role="status"
      className="flex flex-col gap-4 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-5 md:p-6"
    >
      <p className="flex items-center gap-2 text-[13px] text-(--color-text-secondary)">
        <Icon name="spinner" size={16} className="motion-safe:animate-spin" />
        Загружаем свободное время…
      </p>
      <div aria-hidden="true" className="flex flex-wrap gap-2 motion-safe:animate-pulse">
        {Array.from({ length: 6 }, (_, index) => (
          <span key={index} className="h-11 w-[84px] rounded-(--radius-m) bg-(--color-skeleton)" />
        ))}
      </div>
    </div>
  );
}

function SlotLegend() {
  return (
    <ul aria-hidden="true" className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[12px] text-(--color-text-secondary)">
      <li className="flex items-center gap-1.5">
        <span className="size-3.5 rounded border-[1.5px] border-(--color-control-border) bg-(--color-surface-card)" />
        Свободно
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-3.5 rounded border-[1.5px] border-(--color-border-decorative) bg-(--color-surface-page)" />
        Занято
      </li>
      <li className="flex items-center gap-1.5">
        <span className="size-3.5 rounded bg-(--color-cta-bg)" />
        Ваше время
      </li>
    </ul>
  );
}
