/**
 * Даты записи: календарный день — строка «YYYY-MM-DD» в местном времени,
 * время — «HH:MM». Строки не зависят от часового пояса при передаче
 * между страницами, в адресе и в хранилище браузера.
 */

export type IsoDate = string;

const pad = (value: number) => String(value).padStart(2, "0");

export function toIsoDate(date: Date): IsoDate {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(iso: IsoDate): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && toIsoDate(parseIsoDate(value)) === value;
}

export function isTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function addDays(iso: IsoDate, days: number): IsoDate {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

/** День недели: 1 — понедельник … 7 — воскресенье. */
export function isoWeekday(iso: IsoDate): number {
  const day = parseIsoDate(iso).getDay();
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

const dayMonth = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
const weekdayLong = new Intl.DateTimeFormat("ru-RU", { weekday: "long" });
const weekdayShort = new Intl.DateTimeFormat("ru-RU", { weekday: "short" });

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
