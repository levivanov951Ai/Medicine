import { mockId, readLocalJson, writeLocalJson } from "@/lib/browser-storage";
import type { Appointment, AppointmentActions, DoctorAppointment, LabAppointment } from "@/types/appointment";
import { getAppointmentStatus } from "./status";
import type { AppointmentService } from "./types";

/**
 * MOCK-хранилище записей — единый список в localStorage этого браузера.
 * Переживает обновление страницы, закрытие вкладки, выход и повторный вход.
 * Каждая запись принадлежит пациенту (patientId): кабинет показывает только свои.
 *
 * Записи никогда не удаляются: отмена меняет статус, перенос — дату и время.
 * Занятое время расписания вычисляется из действующих записей, поэтому
 * отмена и перенос сами освобождают прежнее время.
 *
 * Здесь нет медицинских данных — только что, когда, где и сколько стоит.
 * При подключении CRM этот файл удаляется: записи будет хранить CRM.
 */

const APPOINTMENTS_KEY = "smlab:mock-appointments";

type NewAppointment = Omit<DoctorAppointment, "id" | "status" | "createdAt"> | Omit<LabAppointment, "id" | "status" | "createdAt">;

const readAll = () => readLocalJson<Appointment[]>(APPOINTMENTS_KEY, []);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Демо-правило (НЕ правило клиники — PRODUCTION RULE UNKNOWN): будущую запись
 * можно отменить и перенести, прошедшую и отменённую — нельзя. Причину для них
 * не показываем: статус записи уже всё объясняет.
 */
function mockActions(appointment: Appointment, now: Date): AppointmentActions {
  const upcoming = getAppointmentStatus(appointment, now) === "upcoming";
  return { canCancel: upcoming, canReschedule: upcoming, restrictionReason: null };
}

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

  /** Новые дата и время записи. Вызывает только MOCK-сервис записи при переносе. */
  moveTo(appointmentId: string, slot: { date: string; time: string }): Appointment | null {
    let moved: Appointment | null = null;
    writeLocalJson(
      APPOINTMENTS_KEY,
      readAll().map((item) => {
        if (item.id !== appointmentId) return item;
        moved = { ...item, date: slot.date, time: slot.time };
        return moved;
      }),
    );
    return moved;
  },

  find(patientId: string, appointmentId: string): Appointment | null {
    return readAll().find((item) => item.id === appointmentId && item.patientId === patientId) ?? null;
  },

  canReschedule(appointment: Appointment): boolean {
    return mockActions(appointment, new Date()).canReschedule;
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
    return mockAppointmentStore.find(patientId, appointmentId);
  },

  async getActions(appointment) {
    return mockActions(appointment, new Date());
  },

  async cancel(patientId, appointmentId) {
    await delay(600);
    const appointment = mockAppointmentStore.find(patientId, appointmentId);
    if (!appointment) return { ok: false, reason: "not-found" };
    if (!mockActions(appointment, new Date()).canCancel) return { ok: false, reason: "not-allowed" };

    const cancelled: Appointment = { ...appointment, status: "cancelled" };
    writeLocalJson(
      APPOINTMENTS_KEY,
      readAll().map((item) => (item.id === appointmentId ? cancelled : item)),
    );
    return { ok: true, appointment: cancelled };
  },
};
