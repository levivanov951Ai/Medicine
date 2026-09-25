"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { ChipToggle } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";

export interface CategoryFilterOption {
  id: string;
  label: string;
  icon: IconName;
  count: number;
}

interface CategoryFilterProps {
  /** Доступное имя навигации: «Направления», «Разделы лаборатории». */
  label: string;
  /** Первый пункт боковой колонки: «Все услуги», «Все врачи», «Все анализы». */
  allLabel: string;
  allCount: number;
  options: CategoryFilterOption[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** Адрес пункта — для открытия в новой вкладке и работы без JavaScript. */
  hrefFor: (id: string | null) => string;
}

/**
 * Фильтр по направлениям — Catalog-*, Doctors-*, Analyses-*.dc.html.
 * Desktop (с 1024px): боковая колонка ссылок, текущий пункт — aria-current.
 * Mobile и планшет: горизонтальная лента чипов-переключателей (aria-pressed);
 * повторное нажатие на выбранный чип снимает фильтр.
 */
export function CategoryFilter({
  label,
  allLabel,
  allCount,
  options,
  selected,
  onSelect,
  hrefFor,
}: CategoryFilterProps) {
  const handleLinkClick = (event: MouseEvent<HTMLAnchorElement>, id: string | null) => {
    // Обычный клик фильтрует на месте; Ctrl/Cmd/средняя кнопка — открывают вкладку.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onSelect(id);
  };

  return (
    <>
      <nav aria-label={label} className="hidden w-[272px] shrink-0 lg:block">
        <ul className="flex flex-col gap-1">
          <li>
            <SidebarLink
              href={hrefFor(null)}
              icon="list"
              label={allLabel}
              count={allCount}
              active={selected === null}
              bold
              onClick={(event) => handleLinkClick(event, null)}
            />
          </li>
          <li aria-hidden="true" className="my-2 h-px bg-(--color-border-decorative)" />
          {options.map((option) => (
            <li key={option.id}>
              <SidebarLink
                href={hrefFor(option.id)}
                icon={option.icon}
                label={option.label}
                count={option.count}
                active={selected === option.id}
                onClick={(event) => handleLinkClick(event, option.id)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div role="group" aria-label={label} className="lg:hidden">
        <ul className="scroll-row -mx-4 gap-2.5 px-4 pt-1 pb-2 md:-mx-6 md:px-6">
          {options.map((option) => (
            <li key={option.id} className="shrink-0">
              <ChipToggle
                pressed={selected === option.id}
                icon={option.icon}
                onClick={() => onSelect(selected === option.id ? null : option.id)}
              >
                {option.label}
              </ChipToggle>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  icon: IconName;
  label: string;
  count: number;
  active: boolean;
  bold?: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}

function SidebarLink({ href, icon, label, count, active, bold, onClick }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-(--radius-m) px-3.5 py-3 text-[15px] transition-colors",
        active
          ? "bg-(--color-surface-info) font-bold text-(--color-nav-active-text)"
          : "text-(--color-text-primary) hover:bg-(--color-surface-hover)",
        !active && (bold ? "font-bold" : "font-semibold"),
      )}
    >
      <span className={cn("flex", active ? "text-(--color-nav-active-text)" : "text-(--color-text-secondary)")}>
        <Icon name={icon} size={20} />
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-[13px] text-(--color-text-secondary) tabular-nums">{count}</span>
    </Link>
  );
}
