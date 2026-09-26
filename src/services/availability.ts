import { formatRelativeDay, toIsoDate } from "@/lib/dates";
import type { BookingPreview, Doctor, DoctorWithSlot } from "@/types/catalog";
import { bookingService } from "./booking";
import type { DayAvailability } from "./booking/types";

/**
 * Расписание для страниц каталога: «Ближайшее время» на карточках врачей,
 * быстрые слоты на странице врача и превью записи на главной.
 * Считается из того же источника, что и календарь записи (bookingService),
 * поэтому время на карточке и в записи всегда совпадает.
 *
 * Зависит от текущего времени — страницы с этими данными рендерятся
 * на каждый запрос, а не заранее.
 */

/** «Сегодня, 14:20» — ближайший свободный слот врача или null. */
export async function getNextSlotLabel(doctorId: string): Promise<string | null> {
  const today = toIsoDate(new Date());
  const [day] = await bookingService.getUpcomingDays({ kind: "doctor", doctorId, serviceId: null }, today, 1);
  const slot = day?.slots.find((item) => item.available);
  return day && slot ? `${formatRelativeDay(day.date, today)}, ${slot.time}` : null;
}

export async function withNextSlots(doctors: Doctor[]): Promise<DoctorWithSlot[]> {
  return Promise.all(
    doctors.map(async (doctor) => ({ ...doctor, nextSlotLabel: await getNextSlotLabel(doctor.id) })),
  );
}

/** Быстрые слоты на странице врача: ближайшие дни со свободным временем. */
export async function getDoctorQuickSlots(doctorId: string, days = 2): Promise<DayAvailability[]> {
  return bookingService.getUpcomingDays(
    { kind: "doctor", doctorId, serviceId: null },
    toIsoDate(new Date()),
    days,
  );
}

/** Превью записи в первом экране главной: три ближайших свободных слота врача. */
export async function getBookingPreview(doctor: Doctor): Promise<BookingPreview | null> {
  const today = toIsoDate(new Date());
  const [day] = await getDoctorQuickSlots(doctor.id, 1);
  const slots = day?.slots.filter((slot) => slot.available).slice(0, 3).map((slot) => slot.time) ?? [];
  if (!day || slots.length === 0) return null;
  return {
    doctorName: doctor.name,
    specialty: doctor.specialty,
    dayLabel: `Ближайшая запись ${formatRelativeDay(day.date, today).toLocaleLowerCase("ru-RU")}`,
    slots,
    selectedSlot: slots[Math.min(1, slots.length - 1)],
  };
}
