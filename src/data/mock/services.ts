/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются сведениями клиники: список услуг и цены — UNKNOWN.
 * Источник: Homepage-Desktop.dc.html, секция «Популярные услуги».
 * Вся папка src/data/mock удаляется при подключении CRM.
 */
import type { Service } from "@/types/catalog";

export const mockServices: Service[] = [
  {
    id: "therapist-primary",
    title: "Приём терапевта первичный",
    categoryLabel: "Терапия",
    price: { amount: 2400 },
  },
  {
    id: "cardiologist",
    title: "Приём кардиолога",
    categoryLabel: "Кардиология",
    price: { amount: 3100, oldAmount: 3800 },
  },
  {
    id: "abdominal-ultrasound",
    title: "УЗИ брюшной полости",
    categoryLabel: "Диагностика",
    price: { amount: 2900 },
  },
  {
    id: "complete-blood-count",
    title: "Общий анализ крови",
    categoryLabel: "Анализы",
    price: { amount: 890, isFrom: true },
  },
  {
    id: "pediatrician",
    title: "Приём педиатра",
    categoryLabel: "Педиатрия",
    price: { amount: 2200 },
  },
  {
    id: "gynecologist-exam",
    title: "Гинекологический осмотр",
    categoryLabel: "Гинекология",
    price: { amount: 2600 },
  },
  {
    id: "ecg",
    title: "ЭКГ с расшифровкой",
    categoryLabel: "Кардиология",
    price: { amount: 1400, isFrom: true },
  },
  {
    id: "dermatologist",
    title: "Консультация дерматолога",
    categoryLabel: "Дерматология",
    price: { amount: 2500 },
  },
];
