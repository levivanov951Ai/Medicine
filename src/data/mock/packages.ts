/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-05, PD-20).
 * НЕ являются реальными комплексами клиники: состав программ — UNKNOWN.
 * Состав собран из демонстрационного набора анализов (analyses.ts) по id.
 * Специальных цен нет: стоимость = сумма анализов (Analyses-*.dc.html,
 * карточка «Комплексное исследование» показывает одну цену).
 */
import type { LabPackage } from "@/types/catalog";

export const mockLabPackages: LabPackage[] = [
  {
    id: "basic-checkup",
    title: "Базовый check-up",
    description: "Общие анализы крови и мочи, биохимия и глюкоза — за один визит.",
    analysisIds: ["complete-blood-count", "urinalysis", "blood-biochemistry", "glucose"],
    packagePrice: null,
  },
  {
    id: "womens-health",
    title: "Женское здоровье",
    description: "Кровь, запасы железа, витамин D и гормоны щитовидной железы.",
    analysisIds: ["complete-blood-count", "ferritin", "vitamin-d", "tsh", "free-t4"],
    packagePrice: null,
  },
  {
    id: "vitamins",
    title: "Витамины и микроэлементы",
    description: "Витамин D, витамин B12, магний и ферритин.",
    analysisIds: ["vitamin-d", "vitamin-b12", "magnesium", "ferritin"],
    packagePrice: null,
  },
  {
    id: "liver",
    title: "Печень",
    description: "Ферменты печени, общий белок и маркеры гепатитов B и C.",
    analysisIds: ["alt", "ast", "total-protein", "hbsag", "anti-hcv"],
    packagePrice: null,
  },
];
