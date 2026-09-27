import type { Metadata } from "next";
import { PackageCard } from "@/components/features/analyses/PackageCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateBlocks";
import { routes } from "@/lib/routes";
import { getLabPackages } from "@/services/analyses";

export const metadata: Metadata = {
  title: "Комплексные программы",
  description: "Комплексные программы анализов: состав и стоимость. Запись на сдачу онлайн.",
};

/**
 * Комплексные программы (check-up, PD-05) — отдельная сущность каталога анализов.
 * Отдельной страницы программы в Design v1 нет: состав раскрывается в карточке.
 * Выбранные программы попадают в общий список выбранных анализов —
 * панель выбора внизу экрана общая для всего раздела «Анализы».
 */
export default async function LabPackagesPage() {
  const packages = await getLabPackages();

  return (
    <Container className="pt-5 pb-7 md:pt-10 md:pb-[72px]">
      <Breadcrumbs items={[{ label: "Анализы", href: routes.lab }]} current="Комплексные программы" />
      <div className="mt-3.5 mb-5 flex max-w-[760px] flex-col gap-2.5 md:mt-5 md:mb-10 md:gap-3">
        <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">Лаборатория</p>
        <h1 className="text-[28px] leading-9 font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
          Комплексные программы
        </h1>
        <p className="text-[16px] leading-6 text-(--color-text-secondary) md:text-[18px] md:leading-7">
          Набор исследований на одну тему — за один визит. Стоимость — сумма анализов в составе.
        </p>
      </div>

      {packages.length === 0 ? (
        <div className="rounded-(--radius-l) bg-(--color-surface-page) px-4 py-10">
          <EmptyState
            icon="layers"
            titleAs="h2"
            title="Программ пока нет"
            description="Выберите нужные анализы в каталоге — записаться можно на любые из них."
            action={
              <Button href={routes.lab} variant="secondary" size="sm">
                Все анализы
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="grid gap-3.5 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {packages.map((item) => (
            <li key={item.labPackage.id} id={item.labPackage.id}>
              <PackageCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
