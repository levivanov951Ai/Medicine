import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  className?: string;
  children: ReactNode;
}

/**
 * Контейнер Design v1: 1200px по центру (на 1440 это поля 120px).
 * Mobile — поля 16px, промежуточные ширины — 24px.
 */
export function Container({ className, children }: ContainerProps) {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-4 md:px-6 xl:px-0", className)}>{children}</div>;
}
