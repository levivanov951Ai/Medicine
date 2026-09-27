import type { IsoDate } from "@/lib/dates";
import type { Appointment } from "@/types/appointment";

/**
 * Контракт сервиса записи. Сейчас его реализует mock-booking-service.ts,
 * позже — реализация поверх CRM с тем же контрактом:
 *
 *   UI → bookingService → MOCK расписание   (сейчас)
 *   UI → bookingService → CRM / backend     (позже)
 *
 * Структура CRM здесь не моделируется. Важно: настоящую защиту от двойной
 * записи (атомарный резерв слота) обеспечит только сервер. MOCK имитирует
 * поведение для одного пользователя в одном браузере.
 */

/** Для чего ищем время: приём врача или процедурный кабинет. */
export type BookingTarget =
  | { kind: "doctor"; doctorId: string; serviceId: string | null }
  | { kind: "lab" };

export interface SlotRef {
  date: IsoDate;
  /** «HH:MM». */
  time: string;
}

export interface TimeSlotInfo {
  time: string;
  available: boolean;
}

/** Один день расписания. Пустой `slots` — в этот день приёма нет. */
export interface DayAvailability {
  date: IsoDate;
  slots: TimeSlotInfo[];
}

export interface Reservation {
  id: string;
  slot: SlotRef;
  /** Момент окончания резерва, миллисекунды (Date.now()). */
  expiresAt: number;
}

export type ReserveResult = { ok: true; reservation: Reservation } | { ok: false; reason: "unavailable" };

/** Имя и телефон в черновике записи. Сам пациент и вход — authService (src/services/auth). */
export interface PatientContact {
  name: string;
  /** 10 цифр после «+7». */
  phoneDigits: string;
}

export interface CreateAppointmentInput {
  target: BookingTarget;
  reservation: Reservation;
  /** Пациент, вошедший по коду (authService). Без входа запись не создаётся (PD-01). */
  patientId: string;
  /** Для записи на анализы — id выбранных анализов. */
  analysisIds?: string[];
}

export type CreateAppointmentResult =
  | { ok: true; appointmentId: string }
  | { ok: false; reason: "expired" | "unavailable" };

export interface RescheduleAppointmentInput {
  patientId: string;
  appointmentId: string;
  /** Для чьего расписания резервировали время: того же врача или процедурного кабинета. */
  target: BookingTarget;
  /** Резерв нового времени — тот же механизм, что при записи (5 минут). */
  reservation: Reservation;
}

export type RescheduleAppointmentResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; reason: "expired" | "unavailable" | "not-allowed" };

export interface BookingService {
  /** На сколько дней вперёд открыта запись. */
  readonly horizonDays: number;
  /** Расписание на `days` дней начиная с `from`. Ошибка загрузки — исключение. */
  getAvailability(target: BookingTarget, from: IsoDate, days: number): Promise<DayAvailability[]>;
  /** Ближайшие дни, в которых есть свободное время (для карточек и быстрых слотов). */
  getUpcomingDays(target: BookingTarget, from: IsoDate, limit: number): Promise<DayAvailability[]>;
  /** Временный резерв слота на время оформления. */
  reserveSlot(target: BookingTarget, slot: SlotRef): Promise<ReserveResult>;
  releaseReservation(reservationId: string): Promise<void>;
  /**
   * Создать запись. Стоимость и адрес фиксирует сервис (не интерфейс);
   * запись сразу появляется в кабинете пациента (appointmentService).
   */
  createAppointment(input: CreateAppointmentInput): Promise<CreateAppointmentResult>;
  /**
   * Перенести запись на зарезервированное время. Услуга, врач, анализы и цена
   * не меняются. При любой ошибке запись остаётся на прежнем времени.
   * Атомарность (прежнее время освобождается ровно тогда, когда занято новое)
   * в production обеспечит сервер / CRM; MOCK её имитирует.
   */
  rescheduleAppointment(input: RescheduleAppointmentInput): Promise<RescheduleAppointmentResult>;
}

/** Резерв слота — 5 минут (PD-02). */
export const RESERVATION_MINUTES = 5;
