"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { AnalysisListItem } from "@/services/analyses";
import { useSelection } from "./use-selection";

interface SelectedAnalysesBarProps {
  catalog: AnalysisListItem[];
}

/**
 * Панель выбранных анализов — Analyses-Desktop («Плавающая панель выбора»)
 * и Analyses-Mobile («Sticky-панель выбора»). В макете — статичный блок,
 * здесь — настоящая закреплённая панель (handoff, раздел 6):
 *
 * - появляется после первого добавленного анализа;
 * - прилипает к нижнему краю экрана (position: sticky) и стоит последней
 *   в разделе «Анализы», поэтому в конце прокрутки занимает своё место
 *   в потоке и не перекрывает последнюю строку списка и подвал;
 * - desktop — справа, шириной до 400px; mobile — во всю ширину.
 *
 * «Выбрано: N» ведёт к списку выбранных, «Перейти к записи» — сразу к записи:
 * при одном анализе отдельный список не обязателен (PD-04).
 */
export function SelectedAnalysesBar({ catalog }: SelectedAnalysesBarProps) {
  const pathname = usePathname();
  const { count, total } = useSelection(catalog);

  // На странице «Выбранные анализы» есть собственный итог.
  if (count === 0 || pathname === routes.labSelected) return null;

  const summary = `Выбрано: ${countLabel(count, WORDS.analysis)}`;

  return (
    <div className="pointer-events-none sticky bottom-0 z-30 mx-auto max-w-[1248px] px-4 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) px-3.5 py-3 shadow-(--shadow-l) md:ml-auto md:max-w-[400px] md:gap-4 md:rounded-(--radius-l) md:py-3.5 md:pr-4 md:pl-5">
        <Link href={routes.labSelected} className="group touch-target min-w-0 flex-1 rounded-(--radius-s)">
          <span aria-live="polite" className="flex flex-col">
            <span className="flex items-center gap-1 text-[12px] text-(--color-text-link-strong) group-hover:underline md:text-[13px]">
              {summary}
              <Icon name="chevron-right" size={14} />
            </span>
            <span className="text-[15px] font-bold text-(--color-text-primary) md:text-[17px]">
              <span className="sr-only">на сумму </span>
              {formatRub(total)}
            </span>
          </span>
        </Link>
        <Button href={routes.bookingLab} size="md" className="shrink-0">
          Перейти к записи
        </Button>
      </div>
    </div>
  );
}
