"use client";

import { useMemo } from "react";
import { useSelectedAnalysisIds } from "@/lib/selected-analyses";
import type { AnalysisListItem } from "@/services/analyses";

/**
 * Выбранные анализы с данными из каталога: список, количество, сумма.
 * id, которых больше нет в каталоге, пропускаются.
 */
export function useSelection(catalog: AnalysisListItem[]) {
  const ids = useSelectedAnalysisIds();

  return useMemo(() => {
    const byId = new Map(catalog.map((item) => [item.analysis.id, item]));
    const items = ids
      .map((id) => byId.get(id))
      .filter((item): item is AnalysisListItem => item !== undefined);
    const total = items.reduce((sum, { analysis }) => sum + analysis.price.amount, 0);
    return { ids, items, count: items.length, total };
  }, [ids, catalog]);
}
