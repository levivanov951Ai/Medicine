import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnalysisRow } from "@/components/features/analyses/AnalysisRow";
import { Button } from "@/components/ui/Button";
import { Search } from "@/components/ui/Search";
import { routes } from "@/lib/routes";
import type { Analysis } from "@/types/catalog";

interface LabSectionProps {
  analyses: Analysis[];
}

/**
 * «02 · Лаборатория — Анализы» на сером фоне.
 * Поиск, строки анализов (desktop 4, mobile 3) и вход в комплексы.
 */
export function LabSection({ analyses }: LabSectionProps) {
  return (
    <section aria-labelledby="lab-title" className="bg-(--color-surface-page)">
      <Container className="py-9 md:py-16">
        <SectionHeading id="lab-title" eyebrow="02 · Лаборатория" title="Анализы" onTinted />

        <Search
          action={routes.lab}
          label="Поиск анализа"
          placeholder="Название анализа"
          className="md:mb-5 md:max-w-[460px]"
        />

        <ul className="mt-3.5 flex flex-col gap-2.5 md:mt-0">
          {analyses.map((analysis) => (
            <li key={analysis.id} className="max-md:nth-[n+4]:hidden">
              <AnalysisRow analysis={analysis} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-3 rounded-[14px] border border-(--color-border-accent) bg-(--color-surface-accent) p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-7 md:py-6">
          <div>
            <h3 className="text-[15px] font-bold text-(--color-text-primary) md:text-[16px]">
              Комплексные программы (check-up)
            </h3>
            <p className="mt-3 text-[13px] leading-[19px] text-(--color-text-secondary) md:mt-1 md:text-[14px] md:leading-5">
              Набор исследований на одну тему — за один визит.
            </p>
          </div>
          <Button href={routes.labPackages} variant="secondary" size="sm" className="w-full md:w-auto">
            Смотреть программы
          </Button>
        </div>
      </Container>
    </section>
  );
}
