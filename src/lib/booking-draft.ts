"use client";

import type { IsoDate } from "./dates";
import { createSessionStore } from "./session-store";
import type { PatientContact, Reservation, SlotRef } from "@/services/booking/types";

/**
 * Черновик записи — состояние мастера между шагами (sessionStorage, только эта вкладка).
 * Медицинских данных здесь нет: только выбранные услуга/врач/время и имя с телефоном.
 *
 * `id` черновика стоит в адресе (`/booking?draft=…`): обновление страницы
 * восстанавливает черновик, а новый вход по ссылке «Записаться» начинает новую запись.
 */

export type DoctorStep = "service" | "doctor" | "datetime" | "patient" | "confirm" | "done";
export type LabStep = "datetime" | "patient" | "confirm" | "done";

/** Сообщение, которое нужно показать на шаге. */
export type BookingNotice =
  | "expired"
  | "slot-unavailable"
  | "unknown-service"
  | "unknown-doctor"
  | "service-not-offered"
  | "requested-slot-unavailable";

interface DraftBase {
  id: string;
  date?: IsoDate;
  time?: string;
  reservation?: Reservation;
  patient?: PatientContact;
  phoneVerified?: boolean;
  notice?: BookingNotice;
  appointmentId?: string;
}

export interface DoctorDraft extends DraftBase {
  flow: "doctor";
  step: DoctorStep;
  serviceId: string | null;
  doctorId: string | null;
  /** Что было известно ещё до входа в запись — эти шаги отмечены пройденными. */
  preset: { service: boolean; doctor: boolean };
  /** Время, выбранное на странице врача, — применяется на шаге «Дата и время». */
  requestedSlot?: SlotRef;
}

export interface LabDraft extends DraftBase {
  flow: "lab";
  step: LabStep;
  /** Состав записи на момент подтверждения — выбранные анализы после записи очищаются. */
  bookedAnalysisIds?: string[];
}

export const doctorDraftStore = createSessionStore<DoctorDraft>("smlab:booking:doctor");
export const labDraftStore = createSessionStore<LabDraft>("smlab:booking:lab");

/** Пациент, подтвердивший номер в этой вкладке, — не спрашиваем код повторно. */
export const mockPatientSession = createSessionStore<PatientContact>("smlab:mock-patient");

export function newDraftId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Поставить id черновика в адрес, не перезагружая страницу. */
export function syncDraftIdToUrl(id: string) {
  const url = new URL(window.location.href);
  url.search = `?draft=${encodeURIComponent(id)}`;
  window.history.replaceState(window.history.state, "", url);
}
