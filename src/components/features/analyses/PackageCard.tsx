"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { LabPackageItem } from "@/services/analyses";
import { AnalysisSelectButton } from "./AnalysisSelectButton";

/**
 * Карточка комплексной программы (Analyses-*, «Комплексное исследование»):
 * название, число анализов, стоимость, «Добавить» и раскрывающийся «Состав».
 *
 * «Добавить» кладёт анализы состава в общий список выбранных анализов (PD-04, PD-05):
 * отдельной корзины программ нет, уже выбранные анализы не дублируются.
 * Стоимость — сумма анализов состава: специальной цены программы в Design v1 нет.
 */
export function PackageCard({ item }: { item: LabPackageItem }) {
  const { labPackage, analyses, regularPrice } = item;
  const [open, setOpen] = useState(false);
  const listId = useId();
  const titleId = useId();
  const ids = analyses.map(({ analysis }) => analysis.id);

  return (
    <article
      aria-labelledby={titleId}
      className="flex h-full flex-col gap-2.5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-[18px] shadow-(--shadow-s)"
    >
      <div className="flex items-center gap-2">
        <span className="flex text-(--color-icon-strong)">
          <Icon name="layers" size={18} />
        </span>
        <h2 id={titleId} className="text-[15px] font-bold text-(--color-text-primary) md:text-[16px]">
          {labPackage.title}
        </h2>
      </div>
      {labPackage.description && (
        <p className="text-[14px] leading-5 text-(--color-text-secondary)">{labPackage.description}</p>
      )}
      <p className="text-[13px] text-(--color-text-secondary)">{countLabel(analyses.length, WORDS.analysis)} в составе</p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-1">
        <p className="text-[20px] font-bold whitespace-nowrap text-(--color-text-primary)">
          <span className="sr-only">Стоимость: </span>
          {formatRub(regularPrice)}
        </p>
        <AnalysisSelectButton analysisId={ids} title={`программа «${labPackage.title}»`} />
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="touch-target inline-flex cursor-pointer items-center gap-1.5 self-start rounded-(--radius-s) text-[15px] font-semibold text-(--color-text-link-strong) hover:underline"
      >
        Состав
        <span className="sr-only"> программы «{labPackage.title}»</span>
        <Icon name="chevron-down" size={16} className={open ? "rotate-180" : undefined} />
      </button>
      <ul id={listId} hidden={!open} className="flex flex-col">
        {analyses.map(({ analysis }) => (
          <li
            key={analysis.id}
            className="flex items-start justify-between gap-3 border-t border-(--color-border-decorative) py-2.5"
          >
            <Link
              href={routes.analysis(analysis.id)}
              className="text-[14px] leading-5 font-semibold text-(--color-text-link-strong) hover:underline"
            >
              {analysis.title}
            </Link>
            <span className="text-[14px] font-semibold whitespace-nowrap text-(--color-text-primary)">
              {formatRub(analysis.price.amount)}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
