"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { authSession } from "@/lib/auth-session";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const tabs = [
  { label: "Мои записи", href: routes.account },
  { label: "Профиль", href: routes.accountProfile },
];

/** «Мои записи» активны и на странице отдельной записи. */
function isActive(pathname: string, href: string) {
  if (href === routes.account) return pathname === routes.account || pathname.startsWith("/account/appointments");
  return pathname === href;
}

/**
 * Навигация кабинета (Account Subnav, Cabinet-*): «Мои записи» / «Профиль»,
 * справа на desktop — «Выйти». На mobile вкладки делят ширину пополам,
 * выход — в профиле. На mobile-странице записи подменю нет (Cabinet-Details-Mobile):
 * там своя ссылка «Все записи». На переносе записи подменю нет совсем.
 */
export function AccountNav() {
  const pathname = usePathname();
  const onDetails = pathname.startsWith("/account/appointments/");
  // Перенос записи — пошаговый экран со своим «Назад», как запись: подменю не нужно.
  if (pathname.endsWith("/reschedule")) return null;

  return (
    <nav
      aria-label="Личный кабинет"
      className={cn(
        "border-b border-(--color-border-decorative) bg-(--color-bg-page)",
        onDetails && "hidden md:block",
      )}
    >
      <Container className="flex items-center justify-between gap-6">
        <ul className="flex flex-1 md:flex-none md:gap-8">
          {tabs.map((tab) => {
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href} className="flex-1 md:flex-none">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center justify-center border-b-2 py-3 text-[14px] font-semibold whitespace-nowrap md:py-4 md:text-[15px]",
                    active
                      ? "border-(--color-nav-active-indicator) text-(--color-nav-active-text)"
                      : "border-transparent text-(--color-text-primary) hover:text-(--color-nav-active-text)",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => authSession.logout()}
          className="hidden min-h-11 cursor-pointer items-center rounded-(--radius-s) text-[14px] font-semibold text-(--color-text-error) hover:underline md:flex"
        >
          Выйти
        </button>
      </Container>
    </nav>
  );
}
