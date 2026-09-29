/**
 * Даты записи: календарный день — строка «YYYY-MM-DD», время — «HH:MM»,
 * оба — по часам клиники (PD-30). Текущий день клиники — `clinicToday()`
 * из `clinic-time.ts`; здесь только календарная арифметика.
 *
 * Внутри строка разворачивается в полночь UTC, и все вычисления и
 * форматирование идут в UTC — результат не зависит от часового пояса
 * сервера или браузера.
 */

export type IsoDate = string;

const pad = (value: number) => String(value).padStart(2, "0");

function toIsoDate(date: Date): IsoDate {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function parseIsoDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && toIsoDate(parseIsoDate(value)) === value;
}

export function isTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** Месяц «YYYY-MM», сдвинутый на `delta` месяцев. */
export function addMonths(month: string, delta: number): string {
  const [year, monthIndex] = month.split("-").map(Number);
  return toIsoDate(new Date(Date.UTC(year, monthIndex - 1 + delta, 1))).slice(0, 7);
}

/** Число дней в месяце «YYYY-MM». */
export function daysInMonth(month: string): number {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
}

/** День недели: 1 — понедельник … 7 — воскресенье. */
export function isoWeekday(iso: IsoDate): number {
  const day = parseIsoDate(iso).getUTCDay();
  return day === 0 ? 7 : day;
}

export function minutesOf(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function timeOf(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

export const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", timeZone: "UTC" });
const weekdayLong = new Intl.DateTimeFormat("ru-RU", { weekday: "long", timeZone: "UTC" });
const weekdayShort = new Intl.DateTimeFormat("ru-RU", { weekday: "short", timeZone: "UTC" });

/** «24 сентября». */
export function formatDayMonthFromIso(iso: IsoDate): string {
  return dayMonth.format(parseIsoDate(iso));
}

/** «24 сентября, четверг». */
export function formatLongDate(iso: IsoDate): string {
  const date = parseIsoDate(iso);
  return `${dayMonth.format(date)}, ${weekdayLong.format(date)}`;
}

/** «24 сентября, чт». */
export function formatShortDate(iso: IsoDate): string {
  const date = parseIsoDate(iso);
  return `${dayMonth.format(date)}, ${weekdayShort.format(date).replace(".", "")}`;
}

/** «Сегодня», «Завтра» или «26 сентября» — относительно `today`. */
export function formatRelativeDay(iso: IsoDate, today: IsoDate): string {
  if (iso === today) return "Сегодня";
  if (iso === addDays(today, 1)) return "Завтра";
  return formatDayMonthFromIso(iso);
}

const dayMonthShort = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" });

/** «24 сент, чт» — компактно, для mobile (Cabinet-*-Mobile). */
export function formatCompactDate(iso: IsoDate): string {
  const date = parseIsoDate(iso);
  return `${dayMonthShort.format(date).replace(".", "")}, ${weekdayShort.format(date).replace(".", "")}`;
}
