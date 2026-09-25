/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * Декоративное превью записи в первом экране главной. Не отражает
 * реальное расписание. Источник: Homepage-Desktop.dc.html, hero.
 */
import type { BookingPreview } from "@/types/catalog";

export const mockBookingPreview: BookingPreview = {
  doctorName: "Врач А. А.",
  specialty: "Терапевт",
  slots: ["10:20", "11:00", "11:40"],
  selectedSlot: "11:00",
};
