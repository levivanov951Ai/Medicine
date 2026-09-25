/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-13, PD-20).
 * НЕ являются реальными акциями клиники: акции — UNKNOWN.
 * Источник: Homepage-Desktop.dc.html, секция «Актуальные предложения».
 */
import type { Promotion } from "@/types/catalog";

export const mockPromotions: Promotion[] = [
  {
    id: "therapist-first-visit",
    title: "Скидка на первичный приём терапевта",
    validUntil: "2026-10-31",
  },
  {
    id: "womens-health-package",
    title: "Комплекс «Женское здоровье» со скидкой",
    validUntil: "2026-10-31",
  },
];
