import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { AnalysisRow } from "@/components/features/analyses/AnalysisRow";
import { PackagesBanner } from "@/components/features/analyses/PackagesBanner";
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

        <PackagesBanner className="mt-4" />
      </Container>
    </section>
  );
}
