import {
  MOCK_BOOKING_HORIZON_DAYS,
  mockDoctorSchedules,
  mockLabSchedule,
  type WeeklySchedule,
} from "@/data/mock/availability";
import { addDays, isoWeekday, minutesOf, timeOf, toIsoDate, type IsoDate } from "@/lib/dates";
import { mockAppointmentStore } from "../appointments/mock-appointment-store";
import { dataSource } from "../source";
import {
  RESERVATION_MINUTES,
  type BookingService,
  type BookingTarget,
  type DayAvailability,
  type Reservation,
  type SlotRef,
} from "./types";

/**
 * MOCK-реализация сервиса записи. Второй (после mock-source.ts) модуль,
 * который читает src/data/mock — только правила расписания.
 *
 * Что имитируется:
 * - занятые слоты — детерминированно, по правилам расписания,
 *   плюс время действующих записей из общего хранилища записей;
 * - резерв — только в этой вкладке (sessionStorage);
 * - созданная запись попадает в хранилище записей (mock-appointment-store)
 *   и сразу видна в личном кабинете пациента;
 * - задержка ответа — чтобы были видны состояния загрузки.
 *
 * Код подтверждения и вход — authService (src/services/auth), не здесь.
 *
 * Сценарии для ручной проверки (sessionStorage «smlab:mock-scenario»):
 * «availability-error» — расписание не загружается;
 * «taken-on-reserve» — выбранное время «только что заняли»;
 * «taken-on-confirm» — время заняли перед подтверждением;
 * «short-reservation» — резерв 20 секунд вместо 5 минут.
 */

const RESERVATIONS_KEY = "smlab:mock-reservations";
const SCENARIO_KEY = "smlab:mock-scenario";

type Scenario = "availability-error" | "taken-on-reserve" | "taken-on-confirm" | "short-reservation";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function hasWindow() {
  return typeof window !== "undefined";
}

function scenario(): Scenario | null {
  if (!hasWindow()) return null;
  try {
    return window.sessionStorage.getItem(SCENARIO_KEY) as Scenario | null;
  } catch {
    return null;
  }
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!hasWindow()) return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Недоступное хранилище — MOCK продолжает работать без памяти между обновлениями.
  }
}

/** Детерминированное «случайное» число 0–1 для ключа — одинаковое на сервере и в браузере. */
function pseudoRandom(key: string): number {
  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

function targetKey(target: BookingTarget) {
  return target.kind === "lab" ? "lab" : `doctor:${target.doctorId}`;
}

function scheduleFor(target: BookingTarget): WeeklySchedule | null {
  return target.kind === "lab" ? mockLabSchedule : (mockDoctorSchedules[target.doctorId] ?? null);
}

const slotKey = (target: BookingTarget, slot: SlotRef) => `${targetKey(target)}|${slot.date}|${slot.time}`;

/** Время, уже занятое действующими записями. */
function bookedSlotKeys(): Set<string> {
  return new Set(
    mockAppointmentStore.activeAppointments().map((item) =>
      slotKey(item.type === "lab" ? { kind: "lab" } : { kind: "doctor", doctorId: item.doctorId, serviceId: null }, item),
    ),
  );
}

function nowParts() {
  const now = new Date();
  return { today: toIsoDate(now), minutes: now.getHours() * 60 + now.getMinutes() };
}

function buildDay(target: BookingTarget, date: IsoDate): DayAvailability {
  const schedule = scheduleFor(target);
  const { today, minutes: nowMinutes } = nowParts();
  const horizonEnd = addDays(today, MOCK_BOOKING_HORIZON_DAYS - 1);
  if (!schedule || date < today || date > horizonEnd || !schedule.weekdays.includes(isoWeekday(date))) {
    return { date, slots: [] };
  }

  const booked = bookedSlotKeys();
  const slots = [];
  for (let minutes = minutesOf(schedule.start); minutes <= minutesOf(schedule.end); minutes += schedule.stepMinutes) {
    // Прошедшее сегодня время не показываем совсем.
    if (date === today && minutes <= nowMinutes) continue;
    const time = timeOf(minutes);
    const key = slotKey(target, { date, time });
    const busy = pseudoRandom(key) < schedule.busyShare || booked.has(key);
    slots.push({ time, available: !busy });
  }
  return { date, slots };
}

function reservations(): Record<string, Reservation & { key: string }> {
  return readJson(RESERVATIONS_KEY, {});
}

/** Стоимость записи по каталогу: цена услуги у врача или сумма анализов. `null` — позиции нет в каталоге. */
async function priceFor(target: BookingTarget, analysisIds: string[]): Promise<number | null> {
  if (target.kind === "doctor") {
    const doctor = await dataSource.getDoctorById(target.doctorId);
    const offer = doctor?.services.find((item) => item.serviceId === target.serviceId);
    return offer?.price.amount ?? null;
  }
  const analyses = await dataSource.getAnalyses();
  const picked = analysisIds.map((id) => analyses.find((item) => item.id === id));
  if (picked.length === 0 || picked.some((item) => !item)) return null;
  return picked.reduce((sum, item) => sum + (item?.price.amount ?? 0), 0);
}

export const mockBookingService: BookingService = {
  horizonDays: MOCK_BOOKING_HORIZON_DAYS,

  async getAvailability(target, from, days) {
    await delay(450);
    if (scenario() === "availability-error") throw new Error("availability unavailable");
    return Array.from({ length: days }, (_, index) => buildDay(target, addDays(from, index)));
  },

  async getUpcomingDays(target, from, limit) {
    const result: DayAvailability[] = [];
    for (let index = 0; index < MOCK_BOOKING_HORIZON_DAYS && result.length < limit; index += 1) {
      const day = buildDay(target, addDays(from, index));
      if (day.slots.some((slot) => slot.available)) result.push(day);
    }
    return result;
  },

  async reserveSlot(target, slot) {
    await delay(350);
    const day = buildDay(target, slot.date);
    const info = day.slots.find((item) => item.time === slot.time);
    if (!info?.available || scenario() === "taken-on-reserve") return { ok: false, reason: "unavailable" };

    const minutes = scenario() === "short-reservation" ? 20 / 60 : RESERVATION_MINUTES;
    const reservation: Reservation = {
      id: `res-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      slot,
      expiresAt: Date.now() + minutes * 60_000,
    };
    writeJson(RESERVATIONS_KEY, { ...reservations(), [reservation.id]: { ...reservation, key: slotKey(target, slot) } });
    return { ok: true, reservation };
  },

  async releaseReservation(reservationId) {
    const all = reservations();
    delete all[reservationId];
    writeJson(RESERVATIONS_KEY, all);
  },

  async createAppointment({ target, reservation, patientId, analysisIds = [] }) {
    await delay(800);
    const stored = reservations()[reservation.id];
    if (!stored || stored.expiresAt <= Date.now()) return { ok: false, reason: "expired" };
    const price = await priceFor(target, analysisIds);
    if (scenario() === "taken-on-confirm" || price === null || (target.kind === "doctor" && !target.serviceId)) {
      await mockBookingService.releaseReservation(reservation.id);
      return { ok: false, reason: "unavailable" };
    }

    await mockBookingService.releaseReservation(reservation.id);
    const { address } = await dataSource.getClinicInfo();
    const common = { patientId, date: reservation.slot.date, time: reservation.slot.time, price, clinicAddress: address };
    const appointment =
      target.kind === "doctor"
        ? mockAppointmentStore.create({ ...common, type: "doctor", doctorId: target.doctorId, serviceId: target.serviceId! })
        : mockAppointmentStore.create({ ...common, type: "lab", analysisIds });
    return { ok: true, appointmentId: appointment.id };
  },
};
