import type { IsoDate } from "@/lib/dates";

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

export type VerifyOtpResult = { ok: true } | { ok: false; reason: "invalid" };

export interface PatientContact {
  name: string;
  /** 10 цифр после «+7». */
  phoneDigits: string;
}

export interface CreateAppointmentInput {
  target: BookingTarget;
  reservation: Reservation;
  patient: PatientContact;
  /** Для записи на анализы — id выбранных анализов. */
  analysisIds?: string[];
}

export type CreateAppointmentResult =
  | { ok: true; appointmentId: string }
  | { ok: false; reason: "expired" | "unavailable" };

export interface BookingService {
  /** Длина кода подтверждения (Booking-Doctor-*: 5 ячеек). */
  readonly otpLength: number;
  /** Тестовый код без настоящей отправки SMS. У реальной реализации — null. */
  readonly testOtpCode: string | null;
  /** На сколько дней вперёд открыта запись. */
  readonly horizonDays: number;
  /** Расписание на `days` дней начиная с `from`. Ошибка загрузки — исключение. */
  getAvailability(target: BookingTarget, from: IsoDate, days: number): Promise<DayAvailability[]>;
  /** Ближайшие дни, в которых есть свободное время (для карточек и быстрых слотов). */
  getUpcomingDays(target: BookingTarget, from: IsoDate, limit: number): Promise<DayAvailability[]>;
  /** Временный резерв слота на время оформления. */
  reserveSlot(target: BookingTarget, slot: SlotRef): Promise<ReserveResult>;
  releaseReservation(reservationId: string): Promise<void>;
  /** Отправка кода подтверждения номера. Возвращает, через сколько секунд можно повторить. */
  sendOtp(phoneDigits: string): Promise<{ resendAfterSeconds: number }>;
  verifyOtp(phoneDigits: string, code: string): Promise<VerifyOtpResult>;
  createAppointment(input: CreateAppointmentInput): Promise<CreateAppointmentResult>;
}

/** Резерв слота — 5 минут (PD-02). */
export const RESERVATION_MINUTES = 5;
