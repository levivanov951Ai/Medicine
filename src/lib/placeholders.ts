/**
 * Placeholder-ы для UNKNOWN-данных (PROJECT_CONTEXT.md, раздел 6).
 * Показываются буквально, в квадратных скобках — так заказчик видит,
 * чего не хватает. Никаких выдуманных значений.
 */
export const PLACEHOLDER = {
  phone: "[Телефон]",
  workingHours: "[Режим работы]",
} as const;

/** `+7 (999) 123-45-67` → `tel:+79991234567`. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
