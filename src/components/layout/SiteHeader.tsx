"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { isNavItemActive, mainNav } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import type { ClinicInfo } from "@/types/clinic";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { PhoneLink } from "./PhoneLink";

const MENU_ID = "mobile-menu";

interface SiteHeaderProps {
  clinic: ClinicInfo;
}

/**
 * Общая шапка сайта (Header-Desktop / Header-Mobile.dc.html).
 *
 * Desktop (≥1280): 80px с нижней границей; при прокрутке — 72px с тенью.
 * Высота внешней обёртки постоянна (80px), поэтому уменьшение шапки
 * не сдвигает страницу. Ниже 1280px — мобильная шапка 64px с меню:
 * полная навигация по ширине туда не помещается.
 *
 * «Записаться» — голубая secondary-кнопка: единственный розовый primary
 * на экране остаётся за героем главной (Header-Desktop.dc.html).
 */
export function SiteHeader({ clinic }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0);
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <header className="pointer-events-none sticky top-0 z-40 h-16 xl:h-20">
      {/* Mobile и промежуточные ширины */}
      <div className="pointer-events-auto flex h-16 items-center border-b border-(--color-border-decorative) bg-(--color-bg-page) xl:hidden">
        <Container className="flex items-center justify-between gap-2.5">
          <Logo name={clinic.name} size="sm" />
          <div className="flex items-center gap-2">
            <Button href={routes.booking} variant="secondary" size="sm">
              Записаться
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              className="touch-target flex size-10 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-(--color-border-decorative) bg-(--color-surface-card) text-(--color-text-primary)"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </Container>
      </div>

      {/* Desktop */}
      <div
        className={cn(
          "pointer-events-auto hidden items-center bg-(--color-bg-page) transition-[height,box-shadow] duration-200 xl:flex",
          scrolled ? "h-[72px] shadow-(--shadow-s)" : "h-20 border-b border-(--color-border-decorative)",
        )}
      >
        <Container className="flex items-center justify-between gap-8">
          <Logo name={clinic.name} />

          <nav aria-label="Основное меню" className="flex flex-1 items-center justify-center gap-7">
            {mainNav.map((item) => {
              const active = isNavItemActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b-2 pb-1 text-[15px] font-semibold whitespace-nowrap transition-colors",
                    active
                      ? "border-(--color-nav-active-indicator) text-(--color-nav-active-text)"
                      : "border-transparent text-(--color-text-primary) hover:text-(--color-nav-active-text)",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            <PhoneLink phone={clinic.phone} iconSize={18} className="text-[15px] whitespace-nowrap" />
            <Link
              href={routes.login}
              className="inline-flex items-center gap-1.5 rounded-(--radius-s) text-[15px] font-semibold text-(--color-text-primary) hover:text-(--color-nav-active-text)"
            >
              <span className="flex text-(--color-icon-accent)">
                <Icon name="user" size={18} />
              </span>
              Войти
            </Link>
            <Button href={routes.booking} variant="secondary" size="sm">
              Записаться
            </Button>
          </div>
        </Container>
      </div>

      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        onClose={closeMenu}
        clinic={clinic}
        pathname={pathname}
        returnFocusRef={menuButtonRef}
      />
    </header>
  );
}
