/**
 * JSON в localStorage — для MOCK-хранилищ, которые должны переживать
 * обновление страницы и закрытие вкладки (пациенты, сессия, записи).
 *
 * На сервере и при недоступном хранилище (приватный режим, запрет cookies)
 * чтение возвращает запасное значение, запись молча пропускается:
 * демо продолжает работать, просто без памяти между визитами.
 *
 * Только для демонстрации. Настоящие данные пациентов будут жить в CRM,
 * не в браузере.
 */

export function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Хранилище недоступно или переполнено — значение живёт до перезагрузки.
  }
}

/** Короткий случайный id для MOCK-сущностей. */
export function mockId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
