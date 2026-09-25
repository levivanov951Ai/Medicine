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

/** Правовые страницы. Содержимое — UNKNOWN (PROJECT_CONTEXT.md, раздел 6). */
export const legalNav: Array<NavItem & { slug: string }> = [
  { slug: "privacy", label: "Политика конфиденциальности", href: routes.legal("privacy") },
  { slug: "terms", label: "Пользовательское соглашение", href: routes.legal("terms") },
  { slug: "offer", label: "Публичная оферта", href: routes.legal("offer") },
];

/** Активен ли пункт меню для текущего пути. Главная не подсвечивает ничего. */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === routes.home) return pathname === routes.home;
  return pathname === href || pathname.startsWith(`${href}/`);
}
