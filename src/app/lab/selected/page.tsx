import type { Metadata } from "next";
import { SelectedAnalysesView } from "@/components/features/analyses/SelectedAnalysesView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { routes } from "@/lib/routes";
import { getAnalysesCatalog } from "@/services/analyses";

export const metadata: Metadata = {
  title: "Выбранные анализы",
  description: "Список выбранных анализов, подготовка и итоговая стоимость перед записью.",
};

/**
 * «Выбранные анализы» — список перед записью (PD-04).
 * Сам выбор хранится в браузере, поэтому список рисуется на клиенте;
 * сервер отдаёт каталог, из которого берутся актуальные цены и подготовка.
 */
export default async function SelectedAnalysesPage() {
  const { items } = await getAnalysesCatalog();

  return (
    <Container className="pt-5 pb-7 md:pt-10 md:pb-[72px]">
      <Breadcrumbs
        items={[{ label: "Анализы", href: routes.lab }]}
        current="Выбранные анализы"
        mobileCurrent="Выбранные"
      />
      <div className="mt-3.5 mb-2.5 flex max-w-[760px] flex-col gap-2.5 md:mt-5 md:mb-10 md:gap-3">
        <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">Перед записью</p>
        <h1 className="text-[28px] leading-9 font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
          Выбранные анализы
        </h1>
        <p className="hidden text-[18px] leading-7 text-(--color-text-secondary) md:block">
          Проверьте список перед тем, как перейти к выбору даты и времени.
        </p>
      </div>
      <SelectedAnalysesView catalog={items} />
    </Container>
  );
}
