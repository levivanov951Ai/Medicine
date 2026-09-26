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
  /** Строка или разметка — например, разные тексты для desktop и mobile. */
  description?: ReactNode;
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

export type NoticeTone = "info" | "warning" | "neutral";

interface NoticeProps {
  tone: NoticeTone;
  icon: IconName;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  /** alert — ошибка, требующая внимания; status — спокойное сообщение. */
  role?: "alert" | "status";
  className?: string;
}

const noticeTones: Record<NoticeTone, { box: string; icon: string }> = {
  info: { box: "border-(--color-border-accent) bg-(--color-surface-accent)", icon: "text-(--color-icon-strong)" },
  warning: { box: "border-(--color-border-warning) bg-(--color-surface-warning)", icon: "text-(--color-text-warning)" },
  neutral: { box: "border-(--color-border-decorative) bg-(--color-surface-page)", icon: "text-(--color-text-secondary)" },
};

/**
 * Сообщение в рамке (Booking-*: «нет времени на дату», «истёк резерв»,
 * «время только что заняли», «нет соединения»): иконка, заголовок,
 * пояснение и действие.
 */
export function Notice({ tone, icon, title, description, action, role, className }: NoticeProps) {
  return (
    <div role={role} className={cn("flex items-start gap-3 rounded-[14px] border p-4", noticeTones[tone].box, className)}>
      <span className={cn("mt-px flex shrink-0", noticeTones[tone].icon)}>
        <Icon name={icon} size={20} />
      </span>
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-[15px] leading-[21px] font-semibold text-(--color-text-primary)">{title}</p>
        {description && (
          <div className="text-[13px] leading-[19px] text-(--color-text-secondary)">{description}</div>
        )}
        {action && <div className="mt-1 flex flex-wrap items-center gap-3">{action}</div>}
      </div>
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
    <Notice
      tone="warning"
      icon="alert"
      role="alert"
      title={title}
      description={description}
      action={action}
      className={className}
    />
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
