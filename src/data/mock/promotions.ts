/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-13, PD-20).
 * НЕ являются реальными акциями клиники: акции — UNKNOWN.
 * Источник: Homepage-Desktop.dc.html, секция «Актуальные предложения».
 * Макет страницы «Акции» (Cabinet-Promos-*) показывает другие демо-акции —
 * по PD-25 набор один, поэтому страница «Акции» использует этот же.
 * Описания и связи — демонстрационные; скидки в ценах каталога не моделируются.
 */
import type { Promotion } from "@/types/catalog";

export const mockPromotions: Promotion[] = [
  {
    id: "therapist-first-visit",
    title: "Скидка на первичный приём терапевта",
    description: "Первичный приём терапевта для тех, кто приходит в клинику впервые.",
    validUntil: "2026-10-31",
    target: { kind: "service", id: "therapist-primary" },
  },
  {
    id: "womens-health-package",
    title: "Комплекс «Женское здоровье»",
    description: "Анализы крови, витамин D и гормоны щитовидной железы — за один визит.",
    validUntil: "2026-10-31",
    target: { kind: "package", id: "womens-health" },
  },
];
