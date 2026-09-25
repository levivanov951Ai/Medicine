"use client";

import Link from "next/link";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { routes } from "@/lib/routes";
import { selectedAnalyses, useSelectedAnalysisIds } from "@/lib/selected-analyses";
import { AnalysisSelectButton } from "./AnalysisSelectButton";

interface AnalysisPageActionProps {
  analysisId: string;
  title: string;
}

/**
 * Главное действие страницы анализа (Analysis-*.dc.html, «Состояния кнопки добавления»):
 * не выбран — primary «Добавить к записи»;
 * выбран — переключатель «Добавлено» и ссылка «Перейти к выбранным».
 * Состояние общее с каталогом и панелью выбранных анализов.
 */
export function AnalysisPageAction({ analysisId, title }: AnalysisPageActionProps) {
  const selected = useSelectedAnalysisIds().includes(analysisId);
  const containerRef = useRef<HTMLDivElement>(null);

  // Кнопка сменяется другой — фокус переводим на новую, чтобы он не терялся.
  const keepFocus = () =>
    requestAnimationFrame(() => containerRef.current?.querySelector<HTMLElement>("button")?.focus());

  return (
    <div ref={containerRef} className="flex min-h-11 flex-wrap items-center gap-x-3.5 gap-y-2 md:min-h-[52px]">
      {selected ? (
        <SelectedState analysisId={analysisId} title={title} />
      ) : (
        <Button
          size="md"
          onClick={() => {
            selectedAnalyses.add(analysisId);
            keepFocus();
          }}
          className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]"
        >
          Добавить к записи
        </Button>
      )}
    </div>
  );
}

function SelectedState({ analysisId, title }: AnalysisPageActionProps) {
  return (
    <>
      <AnalysisSelectButton analysisId={analysisId} title={title} size="md" />
      <Link
        href={routes.labSelected}
        className="touch-target inline-flex items-center gap-1.5 rounded-(--radius-s) py-2 text-[15px] font-semibold text-(--color-text-link-strong) hover:underline"
      >
        Перейти к выбранным
        <Icon name="arrow-right" size={16} />
      </Link>
    </>
  );
}
