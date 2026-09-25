import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";
import { Icon } from "./Icon";

/**
 * Тона из Design-System.dc.html, раздел Badge.
 * Тон «Ошибка» намеренно не реализован: в макете его текст на подложке
 * даёт 4.42 при норме 4.5 (docs/CONTRAST_AUDIT.md, открытые вопросы).
 */
export type BadgeTone = "info" | "success" | "warning" | "promo" | "category";

const tones: Record<BadgeTone, string> = {
  info: "bg-(--color-surface-info) text-(--color-badge-info-fg)",
  success: "bg-(--color-surface-success) text-(--color-text-success)",
  warning: "bg-(--color-surface-warning) text-(--color-text-warning)",
  promo: "bg-(--color-surface-promo) text-(--color-badge-promo-fg)",
  category:
    "bg-(--color-surface-page) text-(--color-text-secondary) border border-(--color-border-decorative)",
};

/**
 * sm — «Акция» рядом с названием в строке каталога (Analyses-*.dc.html);
 * md — стандартный бейдж; lg — «Акция» рядом с крупной ценой (Analysis-*.dc.html).
 */
export type BadgeSize = "sm" | "md" | "lg";

const sizes: Record<BadgeSize, string> = {
  sm: "gap-[5px] px-[9px] py-[3px] text-[12px] leading-4 font-semibold",
  md: "gap-[5px] px-2.5 py-1 text-[13px] leading-[18px] font-semibold",
  lg: "h-9 gap-1.5 px-4 text-[15px] font-bold",
};

interface BadgeProps {
  tone: BadgeTone;
  size?: BadgeSize;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone, size = "md", icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-(--radius-pill)",
        sizes[size],
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}
