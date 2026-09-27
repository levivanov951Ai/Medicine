import type { Appointment, AppointmentActions } from "@/types/appointment";

/**
 * Записи пациента для личного кабинета.
 *
 *   UI → appointmentService → хранилище браузера (MOCK)   (сейчас)
 *   UI → appointmentService → CRM / backend               (позже)
 *
 * Создаёт и переносит записи сервис записи (bookingService) — он же отвечает
 * за расписание и резерв времени. Здесь — чтение, правила и отмена.
 */
export type CancelAppointmentResult =
  | { ok: true; appointment: Appointment }
  | { ok: false; reason: "not-found" | "not-allowed" };

export interface AppointmentService {
  /** Все записи пациента, в порядке создания. */
  listForPatient(patientId: string): Promise<Appointment[]>;
  /** Запись пациента по id. `null` — такой записи нет или она чужая. */
  getForPatient(patientId: string, appointmentId: string): Promise<Appointment | null>;
  /** Можно ли отменить и перенести запись. Правило — за источником данных. */
  getActions(appointment: Appointment): Promise<AppointmentActions>;
  /**
   * Отменить запись. Запись не удаляется: остаётся в истории со статусом
   * «Отменена», её время снова становится свободным.
   */
  cancel(patientId: string, appointmentId: string): Promise<CancelAppointmentResult>;
}
