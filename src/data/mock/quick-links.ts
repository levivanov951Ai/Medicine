/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * Реальный список направлений клиники — UNKNOWN.
 * Источник: Homepage-Desktop / Homepage-Mobile.dc.html, ряд «Быстрый переход».
 */
import { routes } from "@/lib/routes";
import type { QuickLink } from "@/types/catalog";

const servicesIn = (category: string) =>
  `${routes.services}?category=${encodeURIComponent(category)}`;

export const mockQuickLinks: QuickLink[] = [
  { id: "therapy", label: "Терапия", icon: "stethoscope", href: servicesIn("therapy") },
  { id: "cardiology", label: "Кардиология", icon: "heart", href: servicesIn("cardiology") },
  { id: "pediatrics", label: "Педиатрия", icon: "child", href: servicesIn("pediatrics") },
  { id: "gynecology", label: "Гинекология", icon: "user", href: servicesIn("gynecology") },
  {
    id: "diagnostics",
    label: "УЗИ и диагностика",
    shortLabel: "УЗИ",
    icon: "scan",
    href: servicesIn("diagnostics"),
  },
  { id: "lab", label: "Анализы", icon: "flask", href: routes.lab },
  { id: "dentistry", label: "Стоматология", icon: "tooth", href: servicesIn("dentistry") },
];
