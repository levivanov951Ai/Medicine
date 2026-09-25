/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются сведениями клиники: реальные врачи — UNKNOWN.
 * Имена заведомо условные (PROJECT_CONTEXT.md, 7.3), чтобы их нельзя
 * было принять за реальных сотрудников.
 *
 * КАНОНИЧЕСКИЙ набор MOCK-врачей (PROJECT_CONTEXT.md, PD-25): главная,
 * каталог врачей и страницы врачей берут данные только отсюда
 * через service layer. Значения — как на Homepage-Desktop.
 * Расхождения макета каталога (Doctors-Desktop) в данные не переносятся;
 * для каталога набор расширяется здесь, а не копируется.
 */
import type { Doctor } from "@/types/catalog";

export const mockDoctors: Doctor[] = [
  {
    id: "doctor-a",
    name: "Врач А. А.",
    specialty: "Терапевт",
    price: { amount: 2400, isFrom: true },
    nextSlotLabel: "Сегодня, 14:20",
  },
  {
    id: "specialist-1",
    name: "Специалист №1",
    specialty: "Кардиолог",
    price: { amount: 3100, isFrom: true },
    nextSlotLabel: "Завтра, 10:00",
  },
  {
    id: "specialist-2",
    name: "Специалист №2",
    specialty: "Педиатр",
    price: { amount: 2200, isFrom: true },
    nextSlotLabel: "Сегодня, 16:40",
  },
  {
    id: "doctor-b",
    name: "Врач Б. Б.",
    specialty: "Гинеколог",
    price: { amount: 2600, isFrom: true },
    nextSlotLabel: "Завтра, 09:30",
  },
  {
    id: "specialist-3",
    name: "Специалист №3",
    specialty: "Дерматолог",
    price: { amount: 2500, isFrom: true },
    nextSlotLabel: "Сегодня, 18:00",
  },
];
