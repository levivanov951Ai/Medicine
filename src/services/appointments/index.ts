import { minutesOf, toIsoDate } from "@/lib/dates";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { mockAppointmentService } from "./mock-appointment-store";
import type { AppointmentService } from "./types";

/**
 * Единственная точка выбора хранилища записей.
 * При подключении CRM здесь меняется одна строка.
 */
export const appointmentService: AppointmentService = mockAppointmentService;

export type * from "./types";

/**
 * Статус записи в интерфейсе. Отменённая хранится явно; «Завершена» —
 * действующая запись, время которой уже наступило. Время сравнивается
 * по часам браузера: часовой пояс клиники UNKNOWN (блокер production),
 * позже статус будет приходить из CRM.
 */
export function getAppointmentStatus(appointment: Appointment, now: Date = new Date()): AppointmentStatus {
  if (appointment.status === "cancelled") return "cancelled";
  const today = toIsoDate(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const passed =
    appointment.date < today || (appointment.date === today && minutesOf(appointment.time) <= nowMinutes);
  return passed ? "completed" : "upcoming";
}

/** Порядок по времени визита: раньше — первее. */
export function compareByVisit(a: Appointment, b: Appointment): number {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}
