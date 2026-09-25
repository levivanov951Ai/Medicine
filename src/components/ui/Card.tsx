import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardElevation = "s" | "m";

interface CardProps extends HTMLAttributes<HTMLElement> {
  /** Тень: S — базовая оболочка, M — поднятые карточки (услуги, врачи). */
  elevation?: CardElevation;
  as?: "div" | "article" | "li";
  children: ReactNode;
}

const shadows: Record<CardElevation, string> = {
  s: "shadow-(--shadow-s)",
  m: "shadow-(--shadow-m)",
};

/** Базовая оболочка Design v1: белый фон, радиус 16, тонкая граница, мягкая тень. */
export function Card({ elevation = "s", as: Tag = "div", className, children, ...rest }: CardProps) {
  return (
    <Tag
      {...rest}
      className={cn(
        "rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card)",
        shadows[elevation],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
