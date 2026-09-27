import { legalDocuments } from "@/data/legal";
import { routes } from "./routes";

export interface NavItem {
  label: string;
  href: string;
}

/** Главное меню — одинаковое в шапке, мобильном меню и подвале. */
export const mainNav: NavItem[] = [
  { label: "Услуги и цены", href: routes.services },
  { label: "Врачи", href: routes.doctors },
  { label: "Анализы", href: routes.lab },
  { label: "Акции", href: routes.promo },
  { label: "О клинике", href: routes.about },
  { label: "Контакты", href: routes.contacts },
];

/** Правовые страницы — из перечня документов (src/data/legal.ts). Тексты — UNKNOWN. */
export const legalNav: Array<NavItem & { slug: string }> = legalDocuments.map((document) => ({
  slug: document.slug,
  label: document.title,
  href: routes.legal(document.slug),
}));

/** Активен ли пункт меню для текущего пути. Главная не подсвечивает ничего. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}
