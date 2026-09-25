import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { routes } from "@/lib/routes";
import type { Analysis } from "@/types/catalog";

interface AnalysisRowProps {
  analysis: Analysis;
}

/**
 * Строка анализа — секция «Анализы» на главной.
 * Desktop (md+): одна строка — иконка, название + срок/подготовка, цена 110px, кнопка.
 * Mobile: карточка в две строки — название сверху, цена и кнопка снизу.
 * «Подробнее» открывает страницу анализа, где есть цена, срок и подготовка
 * без обязательной записи (сценарий 2, DESIGN_BRIEF.md).
 */
export function AnalysisRow({ analysis }: AnalysisRowProps) {
  const meta = `Срок: ${analysis.turnaround} · Подготовка: ${analysis.preparation}`;

  return (
    <article className="flex flex-col gap-3 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) p-[18px] md:flex-row md:items-center md:gap-5 md:px-[22px]">
      <div className="flex min-w-0 flex-1 items-start gap-3 md:items-center md:gap-5">
        <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg) md:size-9">
          <Icon name="flask" size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-bold break-words text-(--color-text-primary) md:text-[16px]">
            {analysis.title}
          </h3>
          <p className="mt-[3px] text-[12px] text-(--color-text-secondary) md:mt-0.5 md:text-[13px]">{meta}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:contents">
        <Price price={analysis.price} className="md:w-[110px] md:shrink-0" />
        <Button href={routes.analysis(analysis.id)} variant="secondary" size="sm">
          Подробнее
          <span className="sr-only">: {analysis.title}</span>
        </Button>
      </div>
    </article>
  );
}
