"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { authSession } from "@/lib/auth-session";
import { routes } from "@/lib/routes";
import type { Patient } from "@/types/patient";

/** Как пациент подписан в шапке и меню: имя или «Личный кабинет», если имени ещё нет. */
export function patientLabel(patient: Patient): string {
  return patient.name ?? "Личный кабинет";
}

/**
 * Пациент в desktop-шапке (Header-Desktop, «Авторизован — вместо „Войти“ имя»):
 * аватар, имя и шеврон. По нажатию — короткий список: записи, профиль, выход.
 * Раскрывающийся блок с обычными ссылками (disclosure), без роли menu:
 * Tab ходит по пунктам, Escape и клик снаружи закрывают.
 */
export function AccountMenu({ patient }: { patient: Patient }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closedAt, setClosedAt] = useState(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  // Перешли на другую страницу — список закрывается.
  if (open && closedAt !== pathname) {
    setOpen(false);
    setClosedAt(pathname);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemBase = "flex min-h-11 w-full items-center gap-2.5 rounded-(--radius-s) px-3 text-[15px] font-semibold hover:bg-(--color-surface-hover)";
  const linkClass = `${itemBase} text-(--color-text-primary) hover:text-(--color-nav-active-text)`;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((value) => !value);
          setClosedAt(pathname);
        }}
        className="touch-target flex cursor-pointer items-center gap-2.5 rounded-(--radius-s) text-[15px] font-semibold text-(--color-text-primary) hover:text-(--color-nav-active-text)"
      >
        <Avatar name={patient.name} />
        <span className="sr-only">Личный кабинет: </span>
        <span className="max-w-[160px] truncate">{patientLabel(patient)}</span>
        <span className="flex text-(--color-text-secondary)">
          <Icon name="chevron-down" size={16} className={open ? "rotate-180" : undefined} />
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute top-[calc(100%+12px)] right-0 z-50 w-60 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-2 shadow-(--shadow-l)"
        >
          <ul className="flex flex-col">
            <li>
              <Link href={routes.account} className={linkClass}>
                <Icon name="calendar" size={18} />
                Мои записи
              </Link>
            </li>
            <li>
              <Link href={routes.accountProfile} className={linkClass}>
                <Icon name="user" size={18} />
                Профиль
              </Link>
            </li>
            <li className="mt-1 border-t border-(--color-border-decorative) pt-1">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  authSession.logout();
                }}
                className={`${itemBase} cursor-pointer text-(--color-text-error)`}
              >
                Выйти
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
