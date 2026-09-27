import { mockAppointmentService } from "./mock-appointment-store";
import type { AppointmentService } from "./types";

/**
 * Единственная точка выбора хранилища записей.
 * При подключении CRM здесь меняется одна строка.
 */
export const appointmentService: AppointmentService = mockAppointmentService;

export type * from "./types";
export { compareByVisit, getAppointmentStatus } from "./status";
