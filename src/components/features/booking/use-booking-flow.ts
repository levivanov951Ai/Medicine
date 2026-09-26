"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import type { BookingNotice } from "@/lib/booking-draft";
import type { SessionStore } from "@/lib/session-store";
import { bookingService } from "@/services/booking";
import type { BookingTarget, Reservation, SlotRef } from "@/services/booking/types";

interface DraftWithReservation {
  step: string;
  reservation?: Reservation;
  date?: string;
  time?: string;
  notice?: BookingNotice;
}

/**
 * Общая механика обоих мастеров записи: резерв слота, истечение резерва
 * и выход из записи. Сам черновик хранится в sessionStorage (store).
 */
export function useBookingMechanics<T extends DraftWithReservation>(
  store: SessionStore<T>,
  draft: T | null,
  target: BookingTarget | null,
  stepsWithReservation: string[],
) {
  const router = useRouter();
  const patch = useCallback((changes: Partial<T>) => store.update((current) => (current ? { ...current, ...changes } : current)), [store]);

  /** Отпустить резерв и вернуть к выбору времени с сообщением. */
  const dropReservation = useCallback(
    (notice: BookingNotice) => {
      const current = store.get();
      if (current?.reservation) bookingService.releaseReservation(current.reservation.id);
      patch({ reservation: undefined, time: undefined, step: "datetime", notice } as Partial<T>);
    },
    [store, patch],
  );

  // Истечение резерва — по таймеру и сразу после обновления страницы.
  const expiresAt = draft?.reservation?.expiresAt;
  const watching = draft ? stepsWithReservation.includes(draft.step) : false;
  useEffect(() => {
    if (!expiresAt || !watching) return;
    const timeout = window.setTimeout(() => dropReservation("expired"), Math.max(0, expiresAt - Date.now()));
    return () => window.clearTimeout(timeout);
  }, [expiresAt, watching, dropReservation]);

  /** Резерв выбранного слота; предыдущий резерв освобождается. */
  const reserve = useCallback(
    async (slot: SlotRef): Promise<boolean> => {
      if (!target) return false;
      const previous = store.get()?.reservation;
      if (previous) await bookingService.releaseReservation(previous.id);
      const result = await bookingService.reserveSlot(target, slot);
      if (result.ok) {
        patch({ reservation: result.reservation, date: slot.date, time: slot.time, notice: undefined } as Partial<T>);
        return true;
      }
      patch({ reservation: undefined, time: undefined, notice: "slot-unavailable" } as Partial<T>);
      return false;
    },
    [store, target, patch],
  );

  /** «Назад» с первого шага — туда, откуда пришли. */
  const exit = useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }, [router]);

  return { patch, reserve, dropReservation, exit };
}
