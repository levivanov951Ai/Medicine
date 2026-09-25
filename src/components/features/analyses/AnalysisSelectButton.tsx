"use client";

import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { selectedAnalyses, useSelectedAnalysisIds } from "@/lib/selected-analyses";

interface AnalysisSelectButtonProps {
  analysisId: string;
  /** Название — для скринридера: «Добавить: Общий анализ крови». */
  title: string;
  /** sm 36px — строки каталога; md 44px — страница анализа. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Переключатель «Добавить» / «Добавлено» (Analyses-*, Analysis-*.dc.html).
 * Кнопка с aria-pressed: повторное нажатие убирает анализ из выбранных.
 * Выбор одного анализа не открывает отдельный список (PD-04).
 */
export function AnalysisSelectButton({ analysisId, title, size = "sm", className }: AnalysisSelectButtonProps) {
  const selected = useSelectedAnalysisIds().includes(analysisId);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => selectedAnalyses.toggle(analysisId)}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-[7px] rounded-(--radius-m) border-[1.5px] font-semibold whitespace-nowrap transition-colors",
        // Ширина по «Добавлено» — при переключении соседние колонки не сдвигаются.
        size === "sm" ? "touch-target h-9 min-w-[122px] px-3.5 text-[14px]" : "h-11 min-w-[140px] px-[18px] text-[15px]",
        selected
          ? "border-(--color-toggle-selected-bg) bg-(--color-toggle-selected-bg) text-(--color-toggle-selected-fg) hover:border-(--color-toggle-selected-bg-hover) hover:bg-(--color-toggle-selected-bg-hover)"
          : "border-(--color-secondary-border) bg-(--color-surface-card) text-(--color-secondary-fg) hover:bg-(--color-secondary-bg-hover) hover:text-(--color-secondary-fg-active)",
        className,
      )}
    >
      <Icon name={selected ? "check" : "plus"} size={16} />
      {selected ? "Добавлено" : "Добавить"}
      <span className="sr-only">: {title}</span>
    </button>
  );
}
