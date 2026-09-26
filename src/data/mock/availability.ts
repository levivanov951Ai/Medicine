/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются расписанием клиники: реальное расписание — UNKNOWN,
 * его отдаст CRM. Здесь только правила, по которым генерируются
 * демонстрационные свободные и занятые слоты.
 *
 * Единственный источник расписания: запись, «Ближайшее время» на карточках
 * врачей и быстрые слоты на странице врача считаются из этих правил.
 * Источник: Booking-Doctor-*, Booking-Labs-*, DoctorProfile-*.dc.html.
 */

export interface WeeklySchedule {
  /** Рабочие дни: 1 — понедельник … 7 — воскресенье. */
  weekdays: number[];
  /** Первый и последний слот дня, «HH:MM». */
  start: string;
  end: string;
  /** Шаг сетки слотов, минуты. */
  stepMinutes: number;
  /** Доля занятых слотов, 0–1. */
  busyShare: number;
}

/** На сколько дней вперёд открыта запись. */
export const MOCK_BOOKING_HORIZON_DAYS = 31;

/** Расписание врачей. Врач без расписания записи не принимает. */
export const mockDoctorSchedules: Record<string, WeeklySchedule> = {
  "doctor-a": { weekdays: [1, 2, 3, 4, 5], start: "09:00", end: "18:40", stepMinutes: 40, busyShare: 0.35 },
  "specialist-1": { weekdays: [1, 3, 4, 5, 6], start: "09:00", end: "17:20", stepMinutes: 40, busyShare: 0.4 },
  "specialist-2": { weekdays: [1, 2, 4, 5], start: "09:00", end: "18:00", stepMinutes: 40, busyShare: 0.45 },
  "doctor-b": { weekdays: [2, 3, 4, 6], start: "09:30", end: "17:30", stepMinutes: 40, busyShare: 0.35 },
  "specialist-3": { weekdays: [1, 2, 3, 5], start: "12:00", end: "19:20", stepMinutes: 40, busyShare: 0.3 },
  "doctor-v": { weekdays: [1, 2, 3, 4, 5, 6], start: "08:40", end: "16:00", stepMinutes: 40, busyShare: 0.4 },
  "specialist-4": { weekdays: [2, 4, 6], start: "10:00", end: "16:40", stepMinutes: 40, busyShare: 0.3 },
  "specialist-5": { weekdays: [1, 3, 5], start: "13:00", end: "19:40", stepMinutes: 40, busyShare: 0.35 },
  "doctor-g": { weekdays: [2, 3, 5], start: "09:00", end: "15:40", stepMinutes: 40, busyShare: 0.3 },
  "doctor-d": { weekdays: [1, 2, 4], start: "10:00", end: "17:20", stepMinutes: 40, busyShare: 0.35 },
  "specialist-6": { weekdays: [3, 4, 5, 6], start: "09:00", end: "14:20", stepMinutes: 40, busyShare: 0.3 },
  "specialist-7": { weekdays: [1, 2, 3, 4, 5], start: "08:00", end: "15:20", stepMinutes: 40, busyShare: 0.4 },
  "doctor-e": { weekdays: [1, 2, 4, 5], start: "10:00", end: "18:00", stepMinutes: 40, busyShare: 0.35 },
};

/**
 * Процедурный кабинет — отдельное расписание, не связанное с врачами
 * (Booking-Labs-*: утро 08:00–09:40, день 12:00–13:40).
 */
export const mockLabSchedule: WeeklySchedule = {
  weekdays: [1, 2, 3, 4, 5, 6],
  start: "08:00",
  end: "13:40",
  stepMinutes: 20,
  busyShare: 0.3,
};
