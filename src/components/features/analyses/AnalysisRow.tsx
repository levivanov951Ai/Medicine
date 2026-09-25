import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { routes } from "@/lib/routes";
import type { Analysis } from "@/types/catalog";
import { AnalysisSelectButton } from "./AnalysisSelectButton";

interface AnalysisRowProps {
  analysis: Analysis;
  /**
   * home — секция «Анализы» на главной: единственное действие «Подробнее» (PD-24);
   * catalog — каталог «Анализы»: «Подробнее» и выбор «Добавить» (PD-04).
   */
  variant?: "home" | "catalog";
}

export function AnalysisRow({ analysis, variant = "home" }: AnalysisRowProps) {
  return variant === "catalog" ? <CatalogRow analysis={analysis} /> : <HomeRow analysis={analysis} />;
}

/**
 * Главная. Desktop (md+): одна строка — иконка, название + срок/подготовка, цена 110px, кнопка.
 * Mobile: карточка в две строки — название сверху, цена и кнопка снизу.
 * «Подробнее» открывает страницу анализа, где есть цена, срок и подготовка
 * без обязательной записи (сценарий 2, DESIGN_BRIEF.md).
 */
function HomeRow({ analysis }: { analysis: Analysis }) {
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

/**
 * Каталог (Analyses-*.dc.html) — строка списка с разделителями.
 * Цена, срок и подготовка видны сразу, без перехода на страницу анализа (FACT 2.5).
 * Mobile: мета-строка может переноситься — текст не уменьшается и не обрезается.
 */
function CatalogRow({ analysis }: { analysis: Analysis }) {
  const hasDiscount = analysis.price.oldAmount !== undefined;

  return (
    <article className="flex flex-col gap-2.5 border-t border-(--color-border-decorative) py-4 md:flex-row md:items-center md:gap-5 md:px-1 md:py-[18px]">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <h3 className="text-[16px] leading-[22px] font-semibold break-words text-(--color-text-primary)">
            {analysis.title}
          </h3>
          {hasDiscount && (
            <Badge tone="promo" size="sm">
              Акция
            </Badge>
          )}
        </div>
        <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-(--color-text-secondary) md:mt-1.5 md:gap-x-3.5 md:text-[13px]">
          <span className="flex items-center gap-1 md:gap-[5px]">
            <Icon name="clock" size={14} className="size-[13px] md:size-3.5" />
            <span className="sr-only">Срок: </span>
            {analysis.turnaround}
          </span>
          <span className="flex items-center gap-1 md:gap-[5px]">
            <Icon name="file-text" size={14} className="size-[13px] md:size-3.5" />
            <span className="sr-only">Подготовка: </span>
            {analysis.preparation}
          </span>
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 md:contents">
        <Price price={analysis.price} fromColumn className="md:w-[150px] md:shrink-0" />
        <div className="flex items-center gap-3 md:contents">
          <Link
            href={routes.analysis(analysis.id)}
            className="touch-target inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-s) py-2 text-[15px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline"
          >
            Подробнее
            <span className="sr-only">: {analysis.title}</span>
            <Icon name="chevron-right" size={16} />
          </Link>
          <AnalysisSelectButton analysisId={analysis.id} title={analysis.title} />
        </div>
      </div>
    </article>
  );
}
