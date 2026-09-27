import { mockId, readLocalJson, writeLocalJson } from "@/lib/browser-storage";
import type { Appointment, DoctorAppointment, LabAppointment } from "@/types/appointment";
import type { AppointmentService } from "./types";

/**
 * MOCK-хранилище записей — единый список в localStorage этого браузера.
 * Переживает обновление страницы, закрытие вкладки, выход и повторный вход.
 * Каждая запись принадлежит пациенту (patientId): кабинет показывает только свои.
 *
 * Здесь нет медицинских данных — только что, когда, где и сколько стоит.
 * При подключении CRM этот файл удаляется: записи будет хранить CRM.
 */

const APPOINTMENTS_KEY = "smlab:mock-appointments";

type NewAppointment = Omit<DoctorAppointment, "id" | "status" | "createdAt"> | Omit<LabAppointment, "id" | "status" | "createdAt">;

const readAll = () => readLocalJson<Appointment[]>(APPOINTMENTS_KEY, []);

export const mockAppointmentStore = {
  /** Создать действующую запись. Вызывает только MOCK-сервис записи. */
  create(input: NewAppointment): Appointment {
    const appointment = {
      ...input,
      id: mockId("apt"),
      status: "booked",
      createdAt: new Date().toISOString(),
    } as Appointment;
    writeLocalJson(APPOINTMENTS_KEY, [...readAll(), appointment]);
    return appointment;
  },

  /** Действующие записи — чтобы занятое время не предлагалось повторно. */
  activeAppointments(): Appointment[] {
    return readAll().filter((item) => item.status === "booked");
  },
};

export const mockAppointmentService: AppointmentService = {
  async listForPatient(patientId) {
    return readAll().filter((item) => item.patientId === patientId);
  },

  async getForPatient(patientId, appointmentId) {
    return readAll().find((item) => item.id === appointmentId && item.patientId === patientId) ?? null;
  },
};
