import type { IsoDate } from "@/lib/dates";

/**
 * Запись пациента — к врачу или на анализы.
 *
 * Хранятся ссылки на канонические наборы (serviceId, doctorId, analysisIds),
 * а не копии названий: названия всегда берутся из каталога (PD-25).
 * Цена и адрес — снимок на момент записи: это условия, на которых
 * пациент записался, даже если каталог позже изменится.
 *
 * Дата и время — ровно те строки, что выбраны при записи. Часовой пояс
 * клиники UNKNOWN (PROJECT_CONTEXT.md, 6.2), поэтому он не хранится
 * и не показывается.
 *
 * Это НЕ модель будущей CRM — при интеграции поля сверяются с ней.
 */

/**
 * Хранимое состояние записи: «booked» — запись действует, «cancelled» — отменена.
 * «Завершена» не хранится, а вычисляется по времени (getAppointmentStatus).
 */
export type StoredAppointmentState = "booked" | "cancelled";

/** Статус записи в интерфейсе (PD-06). */
export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

interface AppointmentBase {
  id: string;
  patientId: string;
  status: StoredAppointmentState;
  date: IsoDate;
  /** «HH:MM». */
  time: string;
  /** Итоговая стоимость в рублях на момент записи. Оплата — в клинике (PD-11). */
  price: number;
  clinicAddress: string;
  /** ISO 8601. */
  createdAt: string;
}

export interface DoctorAppointment extends AppointmentBase {
  type: "doctor";
  serviceId: string;
  doctorId: string;
}

export interface LabAppointment extends AppointmentBase {
  type: "lab";
  analysisIds: string[];
}

export type Appointment = DoctorAppointment | LabAppointment;
