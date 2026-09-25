"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface StickyActionBarProps {
  /**
   * id основной кнопки страницы. Пока она на экране, панель скрыта —
   * два одинаковых действия одновременно не показываются.
   */
  watchId: string;
  title: string;
  subtitle: string;
  action: ReactNode;
  /** Например, -mx-4 внутри Container — панель во всю ширину экрана. */
  className?: string;
}

/**
 * Закреплённая панель действия у нижнего края экрана — только mobile
 * (Service-Mobile, DoctorProfile-Mobile, SelectedAnalyses-Mobile).
 *
 * Стоит последней в содержимом страницы и прилипает к низу экрана
 * (position: sticky). В конце прокрутки она занимает своё место в потоке
 * и не перекрывает ни последний блок, ни подвал. Пока основная кнопка
 * видна, панели нет совсем — пустое место под неё не резервируется.
 */
export function StickyActionBar({ watchId, title, subtitle, action, className }: StickyActionBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(watchId);
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchId]);

  return (
    <div
      className={cn(
        "pointer-events-none sticky bottom-0 z-30 px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))]",
        visible ? "md:hidden" : "hidden",
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) px-3.5 py-3 shadow-(--shadow-l)">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold text-(--color-text-primary)">{title}</p>
          <p className="truncate text-[12px] text-(--color-text-secondary)">{subtitle}</p>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}
