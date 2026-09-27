import { mockId, readLocalJson, writeLocalJson } from "@/lib/browser-storage";
import type { Patient } from "@/types/patient";
import type { AuthService } from "./types";

/**
 * MOCK-авторизация в браузере. Это демонстрация, а НЕ механизм безопасности:
 * данные лежат в localStorage и доступны любому, кто открыл этот браузер.
 *
 * - код подтверждения — фиксированный MOCK_OTP_CODE, смс не отправляется (PD-26);
 * - «база пациентов» — localStorage: телефон → профиль (только имя и телефон);
 * - сессия — id пациента в localStorage: переживает обновление и закрытие вкладки;
 * - выход удаляет только сессию — профиль и записи остаются, повторный вход
 *   по тому же номеру открывает того же пациента.
 */

/** Тестовый код подтверждения. Не является механизмом безопасности. */
const MOCK_OTP_CODE = "11111";
const RESEND_AFTER_SECONDS = 45;

const PATIENTS_KEY = "smlab:mock-patients";
const AUTH_SESSION_KEY = "smlab:auth-session";

interface StoredSession {
  patientId: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const readPatients = () => readLocalJson<Patient[]>(PATIENTS_KEY, []);
const writePatients = (patients: Patient[]) => writeLocalJson(PATIENTS_KEY, patients);

function currentPatient(): Patient | null {
  const session = readLocalJson<StoredSession | null>(AUTH_SESSION_KEY, null);
  if (!session) return null;
  const patient = readPatients().find((item) => item.id === session.patientId) ?? null;
  // Сессия ссылается на удалённый профиль — считаем пациента гостем.
  if (!patient) writeLocalJson(AUTH_SESSION_KEY, null);
  return patient;
}

function savePatient(patient: Patient) {
  writePatients([...readPatients().filter((item) => item.id !== patient.id), patient]);
}

export const mockAuthService: AuthService = {
  otpLength: MOCK_OTP_CODE.length,
  testOtpCode: MOCK_OTP_CODE,

  async restoreSession() {
    return currentPatient();
  },

  async requestOtp() {
    await delay(700);
    return { resendAfterSeconds: RESEND_AFTER_SECONDS };
  },

  async verifyOtp(phoneDigits, code, details) {
    await delay(700);
    if (code !== MOCK_OTP_CODE) return { ok: false, reason: "invalid" };

    const name = details?.name?.trim() || null;
    const existing = readPatients().find((item) => item.phoneDigits === phoneDigits);
    const patient: Patient = existing
      ? { ...existing, name: name ?? existing.name }
      : { id: mockId("pat"), name, phoneDigits, createdAt: new Date().toISOString() };
    savePatient(patient);
    writeLocalJson(AUTH_SESSION_KEY, { patientId: patient.id } satisfies StoredSession);
    return { ok: true, patient };
  },

  async getCurrentPatient() {
    return currentPatient();
  },

  async updateProfile({ name }) {
    await delay(400);
    const patient = currentPatient();
    if (!patient) throw new Error("not authenticated");
    const updated = { ...patient, name: name.trim() };
    savePatient(updated);
    return updated;
  },

  async logout() {
    writeLocalJson(AUTH_SESSION_KEY, null);
  },
};
