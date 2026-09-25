/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * Реальный список направлений клиники и разделов лаборатории — UNKNOWN.
 * Источник: Catalog-*, Doctors-*, Analyses-*.dc.html (боковая колонка и чипы).
 *
 * Направления общие для услуг и врачей: одна и та же «Кардиология»
 * в каталоге услуг и в каталоге врачей.
 */
import type { Category } from "@/types/catalog";

export const mockServiceCategories: Category[] = [
  { id: "therapy", label: "Терапия", icon: "stethoscope" },
  { id: "cardiology", label: "Кардиология", icon: "heart" },
  { id: "pediatrics", label: "Педиатрия", icon: "child" },
  { id: "gynecology", label: "Гинекология", icon: "user" },
  { id: "endocrinology", label: "Эндокринология", icon: "flask" },
  { id: "diagnostics", label: "УЗИ и диагностика", icon: "scan" },
  { id: "neurology", label: "Неврология", icon: "brain" },
  { id: "ophthalmology", label: "Офтальмология", icon: "eye" },
  { id: "dermatology", label: "Дерматология", icon: "drop" },
  { id: "dentistry", label: "Стоматология", icon: "tooth" },
];

/**
 * Раздел «Комплексные исследования» из макета сюда не входит:
 * комплексы — отдельная сущность (PD-05), их страница — следующий этап.
 */
export const mockAnalysisCategories: Category[] = [
  { id: "general", label: "Общие анализы", icon: "flask" },
  { id: "biochemistry", label: "Биохимия", icon: "drop" },
  { id: "hormones", label: "Гормоны", icon: "activity" },
  { id: "vitamins", label: "Витамины", icon: "pill" },
  { id: "infections", label: "Инфекции", icon: "shield" },
  { id: "allergy", label: "Аллергология", icon: "alert" },
  { id: "oncomarkers", label: "Онкомаркеры", icon: "scan" },
];
