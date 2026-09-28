"use client";

import { useSyncExternalStore } from "react";
import { authService } from "@/services/auth";
import { forgetPatientInDrafts } from "./booking-draft";
import type { Patient } from "@/types/patient";

/**
 * Единое состояние авторизации для всего сайта: шапка, мобильное меню,
 * вход (/login), запись (/booking, /booking/lab) и личный кабинет.
 * Второго auth-состояния в проекте нет.
 *
 * Хранилище без библиотек на useSyncExternalStore — как выбранные анализы.
 * Все действия идут через authService: UI не знает, где живёт сессия
 * (сейчас MOCK в браузере, позже — сервер).
 *
 * Состояния:
 * - loading — сессия ещё восстанавливается (сервер, гидратация, первые миллисекунды);
 * - guest — не вошёл;
 * - authenticated — вошёл, известен пациент.
 *
 * Это клиентская демонстрация, а не защита данных: настоящая проверка
 * доступа появится на сервере вместе с реальной авторизацией.
 */

export type AuthState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "authenticated"; patient: Patient };

const LOADING: AuthState = { status: "loading" };

let state: AuthState = LOADING;
let restoring: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: AuthState) {
  // То же самое состояние (например, после события storage из-за другого ключа) — без перерисовки.
  if (JSON.stringify(next) === JSON.stringify(state)) return;
  state = next;
  listeners.forEach((listener) => listener());
}

function restore(): Promise<void> {
  restoring ??= authService
    .restoreSession()
    .then((patient) => setState(patient ? { status: "authenticated", patient } : { status: "guest" }))
    .catch(() => setState({ status: "guest" }))
    .finally(() => {
      restoring = null;
    });
  return restoring;
}

/** Вход или выход в другой вкладке — пересчитываем состояние. */
function onStorage() {
  restore();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  if (state.status === "loading") restore();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => state;
const getServerSnapshot = () => LOADING;

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export const authSession = {
  get: getSnapshot,

  /** Текущий пациент прямо сейчас — например, перед созданием записи. */
  async currentPatient(): Promise<Patient | null> {
    const patient = await authService.getCurrentPatient();
    setState(patient ? { status: "authenticated", patient } : { status: "guest" });
    return patient;
  },

  requestOtp: (phoneDigits: string) => authService.requestOtp(phoneDigits),

  /** Проверка кода. При успехе пациент входит сразу на всём сайте. */
  async verifyOtp(phoneDigits: string, code: string, details?: { name?: string }) {
    const result = await authService.verifyOtp(phoneDigits, code, details);
    if (result.ok) setState({ status: "authenticated", patient: result.patient });
    return result;
  },

  async updateProfile(changes: { name: string }): Promise<Patient> {
    const patient = await authService.updateProfile(changes);
    setState({ status: "authenticated", patient });
    return patient;
  },

  async logout() {
    await authService.logout();
    // Имя и телефон из незавершённой записи — тоже данные пациента (booking-draft.ts).
    forgetPatientInDrafts();
    setState({ status: "guest" });
  },
};

export const otpLength = authService.otpLength;
export const testOtpCode = authService.testOtpCode;
