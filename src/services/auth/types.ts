import type { Patient } from "@/types/patient";

/**
 * Контракт авторизации пациента (PD-01: телефон → код → пациент вошёл).
 * Один сервис для входа (/login), записи (/booking, /booking/lab) и кабинета.
 *
 *   UI → authService → MOCK (браузер)                      (сейчас)
 *   UI → authService → backend / OTP-провайдер / CRM       (позже)
 *
 * Отправка смс, провайдер и устройство сессии не проектируются (PROJECT_CONTEXT.md, 4.2).
 * HTTP-эндпоинтов для MOCK нет. Пароля нет ни на одном шаге.
 */

export type VerifyOtpResult = { ok: true; patient: Patient } | { ok: false; reason: "invalid" };

export interface AuthService {
  /** Длина кода подтверждения (Design v1: 5 ячеек). */
  readonly otpLength: number;
  /**
   * Тестовый код без настоящей отправки смс. У реальной реализации — null.
   * Показывается только при NEXT_PUBLIC_DEMO_MODE=true (PD-26).
   */
  readonly testOtpCode: string | null;

  /** Восстановить сессию после обновления страницы. `null` — гость. */
  restoreSession(): Promise<Patient | null>;
  /** Отправить код. Возвращает, через сколько секунд можно запросить повторно. */
  requestOtp(phoneDigits: string): Promise<{ resendAfterSeconds: number }>;
  /**
   * Проверить код. При успехе пациент входит: известный номер — прежний профиль,
   * новый — профиль создаётся автоматически (PD-01). `name` — имя, введённое
   * при записи: сохраняется в профиль.
   */
  verifyOtp(phoneDigits: string, code: string, details?: { name?: string }): Promise<VerifyOtpResult>;
  /** Текущий пациент или null. */
  getCurrentPatient(): Promise<Patient | null>;
  /** Изменить данные профиля. Телефон не меняется (PD-21). */
  updateProfile(changes: { name: string }): Promise<Patient>;
  /** Завершить сессию. Профиль и записи пациента остаются. */
  logout(): Promise<void>;
}
