import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";
import { Icon } from "./Icon";

/**
 * Empty / Error / Loading — единая форма из Design-System.dc.html
 * («Empty State / Error State / Loading»): иконка или скелетон,
 * заголовок, пояснение, опциональное действие.
 */

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
  /** Тег заголовка: h1 — когда блок единственное содержимое страницы (404). */
  titleAs?: "p" | "h1" | "h2" | "h3";
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = "search",
  action,
  titleAs: Title = "p",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 px-1 py-2 text-center", className)}>
      <span className="flex text-(--color-icon-muted)">
        <Icon name={icon} size={28} />
      </span>
      <Title className="text-[15px] font-bold text-(--color-text-primary)">{title}</Title>
      {description && (
        <p className="max-w-[320px] text-[13px] leading-[19px] text-(--color-text-secondary)">{description}</p>
      )}
      {action && <div className="mt-1.5 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({ title, description, action, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-[14px] border p-4",
        "border-(--color-border-warning) bg-(--color-surface-warning)",
        className,
      )}
    >
      <span className="mt-px flex text-(--color-text-warning)">
        <Icon name="alert" size={20} />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-[15px] leading-[21px] font-semibold text-(--color-text-primary)">{title}</p>
        {description && (
          <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">{description}</p>
        )}
        {action && <div className="mt-1 flex flex-wrap items-center gap-3">{action}</div>}
      </div>
    </div>
  );
}

interface LoadingStateProps {
  /** Текст для скринридера. */
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Загрузка", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn("rounded-[14px] border border-(--color-border-decorative) p-4", className)}
    >
      <span className="sr-only">{label}</span>
      <div aria-hidden="true" className="flex flex-col gap-2.5 motion-safe:animate-pulse">
        <div className="h-14 w-[70%] rounded-[10px] bg-(--color-skeleton)" />
        <div className="h-3.5 w-[45%] rounded-md bg-(--color-skeleton)" />
        <div className="h-3.5 w-[60%] rounded-md bg-(--color-skeleton)" />
      </div>
    </div>
  );
}
