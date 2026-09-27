import { selectImplementation } from "../config";
import { mockAppointmentService } from "./mock-appointment-store";
import type { AppointmentService } from "./types";

/**
 * Записи пациента: список, детали, правила, отмена.
 * Реализация выбирается переключателем DATA_SOURCE (services/config.ts).
 */
export const appointmentService: AppointmentService = selectImplementation("appointmentService", {
  mock: mockAppointmentService,
});

export type * from "./types";
export { compareByVisit, getAppointmentStatus } from "./status";
