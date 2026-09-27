import type { Appointment } from "@/types/appointment";

/**
 * Записи пациента для личного кабинета.
 *
 *   UI → appointmentService → хранилище браузера (MOCK)   (сейчас)
 *   UI → appointmentService → CRM / backend               (позже)
 *
 * Создаёт записи сервис записи (bookingService.createAppointment) — второго
 * пути создания нет, поэтому в кабинете видны ровно те записи, что сделаны
 * через /booking и /booking/lab.
 *
 * Отмена и перенос — следующий этап (PD-06); здесь их пока нет.
 */
export interface AppointmentService {
  /** Все записи пациента, в порядке создания. */
  listForPatient(patientId: string): Promise<Appointment[]>;
  /** Запись пациента по id. `null` — такой записи нет или она чужая. */
  getForPatient(patientId: string, appointmentId: string): Promise<Appointment | null>;
}
