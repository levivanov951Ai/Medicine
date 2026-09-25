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

interface BadgeProps {
  tone: BadgeTone;
  icon?: IconName;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone, icon, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[5px] whitespace-nowrap rounded-(--radius-pill) px-2.5 py-1",
        "text-[13px] leading-[18px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
    </span>
  );
}
