"use client";

import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { isNavItemActive, mainNav } from "@/lib/navigation";
import { routes } from "@/lib/routes";
import type { ClinicInfo } from "@/types/clinic";
import { Logo } from "./Logo";
import { PhoneLink } from "./PhoneLink";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  clinic: ClinicInfo;
  pathname: string;
  /** Куда вернуть фокус после закрытия — кнопка «Открыть меню». */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

/**
 * Открытое мобильное меню (Header-Mobile.dc.html, «Открытое меню»).
 *
 * Построено на нативном <dialog> в модальном режиме — браузер сам:
 * удерживает фокус внутри, закрывает по Escape, делает фон недоступным.
 * Прокрутка страницы под меню блокируется вручную.
 */
export function MobileMenu({ id, open, onClose, clinic, pathname, returnFocusRef }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Срабатывает при любом закрытии: крестик, ссылка, Escape.
    const handleClose = () => {
      document.documentElement.style.overflow = "";
      onClose();
      returnFocusRef.current?.focus();
    };
    dialog.addEventListener("close", handleClose);

    // Экран стал шире — показывается desktop-шапка, меню больше не нужно.
    const desktop = window.matchMedia("(min-width: 1280px)");
    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches && dialog.open) dialog.close();
    };
    desktop.addEventListener("change", handleResize);

    return () => {
      dialog.removeEventListener("close", handleClose);
      desktop.removeEventListener("change", handleResize);
      document.documentElement.style.overflow = "";
    };
  }, [onClose, returnFocusRef]);

  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-label="Меню сайта"
      className="pointer-events-auto fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-(--color-bg-page) p-0 text-(--color-text-primary) backdrop:bg-transparent xl:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-(--color-border-decorative) p-4">
          <Logo name={clinic.name} size="sm" onNavigate={close} />
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Закрыть меню"
            className="touch-target flex size-10 shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-(--color-border-decorative) bg-(--color-surface-card) text-(--color-text-primary)"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav aria-label="Основное меню" className="flex flex-1 flex-col overflow-auto px-4 py-1">
          {mainNav.map((item) => {
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between border-b border-(--color-border-decorative) py-4 text-[18px] font-semibold",
                  active ? "text-(--color-nav-active-text)" : "text-(--color-text-primary)",
                )}
              >
                {item.label}
                <span className="flex text-(--color-icon-muted)">
                  <Icon name="chevron-right" size={18} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3.5 border-t border-(--color-border-decorative) p-4">
          <PhoneLink phone={clinic.phone} iconSize={20} className="min-h-11 gap-2.5 text-[16px]" />
          <Link
            href={routes.login}
            onClick={close}
            className="inline-flex min-h-11 items-center gap-2.5 self-start rounded-(--radius-s) text-[16px] font-semibold text-(--color-text-primary)"
          >
            <Icon name="user" size={20} />
            Войти
          </Link>
          <Button href={routes.booking} variant="secondary" size="md" fullWidth>
            Записаться
          </Button>
        </div>
      </div>
    </dialog>
  );
}
