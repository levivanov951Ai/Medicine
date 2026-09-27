import type { Metadata } from "next";
import { PromoCard } from "@/components/features/promotions/PromoCard";
import { Container } from "@/components/layout/Container";
import { EmptyState } from "@/components/ui/StateBlocks";
import { getActivePromotions } from "@/services/promotions";

export const metadata: Metadata = {
  title: "Акции",
  description: "Действующие предложения клиники на услуги, анализы и комплексные программы.",
};

/** Закончившиеся акции отсеиваются по текущей дате — страница собирается на каждый запрос. */
export const dynamic = "force-dynamic";

/**
 * «Акции» (Cabinet-Promos-*). Набор акций — тот же, что на главной (PD-25).
 * Подписи «Демо…» из макета не выводятся: MOCK невидим в интерфейсе (PD-20).
 * «Узнать больше» ведёт на услугу, анализ или программу, к которой относится акция (PD-13).
 */
export default async function PromotionsPage() {
  const promotions = await getActivePromotions();

  return (
    <Container className="pt-5 pb-9 md:pt-10 md:pb-14">
      <h1 className="text-[26px] leading-[33px] font-bold text-(--color-text-primary) md:text-[36px] md:leading-[44px]">
        Акции
      </h1>
      <p className="mt-1.5 max-w-[640px] text-[14px] leading-5 text-(--color-text-secondary) md:mt-2 md:text-[16px] md:leading-6">
        Предложения клиники на услуги, анализы и комплексные программы.
      </p>

      {promotions.length === 0 ? (
        <div className="mt-6 rounded-(--radius-l) bg-(--color-surface-page) px-4 py-10 md:mt-8">
          <EmptyState
            icon="heart"
            titleAs="h2"
            title="Сейчас нет активных акций"
            description="Загляните позже — здесь появятся новые предложения клиники."
          />
        </div>
      ) : (
        <ul className="mt-5 grid gap-3.5 md:mt-8 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {promotions.map((item) => (
            <li key={item.promotion.id}>
              <PromoCard item={item} variant="list" headingLevel="h2" />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
