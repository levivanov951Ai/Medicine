import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { PromoCard } from "@/components/features/promotions/PromoCard";
import type { Promotion } from "@/types/catalog";

interface PromotionsSectionProps {
  promotions: Promotion[];
}

/** «04 · Акции — Актуальные предложения». Без акций секция не выводится. */
export function PromotionsSection({ promotions }: PromotionsSectionProps) {
  if (promotions.length === 0) return null;

  return (
    <section aria-labelledby="promotions-title">
      <Container className="pt-8 pb-2 md:py-12">
        <SectionHeading id="promotions-title" eyebrow="04 · Акции" title="Актуальные предложения" />
        <ul className="scroll-row -mx-4 gap-3.5 px-4 pb-2 md:mx-0 md:flex-wrap md:gap-4 md:overflow-visible md:p-0">
          {promotions.map((promotion) => (
            // Mobile: ширина по содержимому, минимум 250px — как в макете
            <li
              key={promotion.id}
              className="max-w-[calc(100vw-16px)] min-w-[250px] shrink-0 md:max-w-none md:min-w-[280px] md:flex-1"
            >
              <PromoCard promotion={promotion} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
