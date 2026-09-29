import { clinicNow } from "@/lib/clinic-time";
import { minutesOf } from "@/lib/dates";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

/**
 * Статус записи в интерфейсе. Отменённая хранится явно; «Завершена» —
 * действующая запись, время которой уже наступило по часам клиники (PD-30).
 * Позже статус будет приходить из CRM.
 */
export function getAppointmentStatus(appointment: Appointment, now: Date = new Date()): AppointmentStatus {
  if (appointment.status === "cancelled") return "cancelled";
  const { date: today, minutes: nowMinutes } = clinicNow(now);
  const passed =
    appointment.date < today || (appointment.date === today && minutesOf(appointment.time) <= nowMinutes);
  return passed ? "completed" : "upcoming";
}

/** Порядок по времени визита: раньше — первее. */
export function compareByVisit(a: Appointment, b: Appointment): number {
  return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
}
