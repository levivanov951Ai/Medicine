/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются сведениями клиники: каталог анализов, цены, сроки
 * и подготовка — UNKNOWN. Подготовка здесь — не медицинская
 * рекомендация, а демонстрационный текст для вёрстки.
 * Источник: Homepage-Desktop.dc.html, секция «Анализы».
 */
import type { Analysis } from "@/types/catalog";

export const mockAnalyses: Analysis[] = [
  {
    id: "complete-blood-count",
    title: "Общий анализ крови",
    price: { amount: 890 },
    turnaround: "1 рабочий день",
    preparation: "Натощак, 8–12 часов",
  },
  {
    id: "blood-biochemistry",
    title: "Биохимический анализ крови",
    price: { amount: 1450 },
    turnaround: "1–2 рабочих дня",
    preparation: "Натощак",
  },
  {
    id: "urinalysis",
    title: "Общий анализ мочи",
    price: { amount: 560 },
    turnaround: "1 рабочий день",
    preparation: "Утренняя порция",
  },
  {
    id: "vitamin-d",
    title: "Витамин D",
    price: { amount: 2100 },
    turnaround: "3 рабочих дня",
    preparation: "Натощак",
  },
];
