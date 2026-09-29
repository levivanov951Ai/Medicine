import { clinic } from "@/data/clinic";
import type { IsoDate } from "./dates";

/**
 * «Сейчас» по часам клиники (PD-30), а не сервера или браузера: сервер
 * хостинга работает в UTC, посетитель может быть в любом поясе, а расписание,
 * «Сегодня / Завтра» и статус записи относятся к календарю клиники.
 * Время слотов и записей («15:00») — тоже время клиники.
 */
const clinicClock = new Intl.DateTimeFormat("en-CA", {
  timeZone: clinic.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export interface ClinicMoment {
  date: IsoDate;
  /** Минуты от начала дня клиники. */
  minutes: number;
}

export function clinicNow(at: Date = new Date()): ClinicMoment {
  const part = Object.fromEntries(clinicClock.formatToParts(at).map(({ type, value }) => [type, value]));
  return {
    date: `${part.year}-${part.month}-${part.day}`,
    minutes: Number(part.hour) * 60 + Number(part.minute),
  };
}

export function clinicToday(at?: Date): IsoDate {
  return clinicNow(at).date;
}
