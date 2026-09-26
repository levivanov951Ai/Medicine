/**
 * Российский номер: храним 10 цифр после «+7», показываем по маске.
 */

export const PHONE_DIGITS = 10;

/** Только цифры номера без «+7» / «8» в начале, не больше 10. */
export function normalizePhoneDigits(input: string): string {
  let digits = input.replace(/\D/g, "");
  if (digits.length > PHONE_DIGITS && (digits.startsWith("7") || digits.startsWith("8"))) {
    digits = digits.slice(1);
  }
  return digits.slice(0, PHONE_DIGITS);
}

/** «9151234567» → «(915) 123-45-67»; неполный номер — по мере ввода. */
export function formatPhoneDigits(digits: string): string {
  const d = digits.slice(0, PHONE_DIGITS);
  if (!d) return "";
  let result = `(${d.slice(0, 3)}`;
  if (d.length >= 3) result += ")";
  if (d.length > 3) result += ` ${d.slice(3, 6)}`;
  if (d.length > 6) result += `-${d.slice(6, 8)}`;
  if (d.length > 8) result += `-${d.slice(8, 10)}`;
  return result;
}

export function isCompletePhone(digits: string): boolean {
  return digits.length === PHONE_DIGITS;
}

/** «+7 (915) ***-**-67» — в сводке номер показывается частично. */
export function maskPhone(digits: string): string {
  return `+7 (${digits.slice(0, 3)}) ***-**-${digits.slice(8, 10)}`;
}
