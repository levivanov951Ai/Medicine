import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";
import { Icon } from "./Icon";

const base =
  "inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-(--radius-pill) px-3.5 " +
  "text-[14px] font-semibold border-[1.5px]";

/** Chip из Design-System.dc.html: по умолчанию и выбранный (aria-pressed). */
const idle =
  "bg-(--color-surface-card) text-(--color-text-primary) border-(--color-border-decorative)";
const selected =
  "bg-(--color-surface-info) text-(--color-secondary-fg-active) border-(--color-secondary-border)";

interface ChipContentProps {
  icon?: IconName;
  children: ReactNode;
}

function ChipContent({ icon, children }: ChipContentProps) {
  return (
    <>
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </>
  );
}

/**
 * Неинтерактивная метка в форме чипа (например, направление на карточке услуги).
 * Граница декоративная — текст сам опознаёт элемент.
 */
export function ChipLabel({ icon, children, className }: ChipContentProps & { className?: string }) {
  return (
    <span className={cn(base, idle, className)}>
      <ChipContent icon={icon}>{children}</ChipContent>
    </span>
  );
}

/** Чип-ссылка: переход в раздел (ряд «Быстрый переход» на главной). */
export function ChipLink({
  href,
  icon,
  children,
  className,
}: ChipContentProps & { href: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        base,
        idle,
        "touch-target transition-colors hover:border-(--color-secondary-border) hover:text-(--color-secondary-fg-active)",
        className,
      )}
    >
      <ChipContent icon={icon}>{children}</ChipContent>
    </Link>
  );
}

/** Чип-фильтр с состоянием «выбран» — для каталогов следующих этапов. */
export function ChipToggle({
  pressed,
  icon,
  children,
  className,
  ...rest
}: ChipContentProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-pressed"> & { pressed: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      aria-pressed={pressed}
      className={cn(base, pressed ? selected : idle, "touch-target transition-colors", className)}
    >
      <ChipContent icon={icon}>{children}</ChipContent>
      {pressed && <Icon name="check" size={14} />}
    </button>
  );
}
