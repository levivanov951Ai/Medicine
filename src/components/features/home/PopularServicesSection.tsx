import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ServiceCard } from "@/components/features/services/ServiceCard";
import { routes } from "@/lib/routes";
import type { Service } from "@/types/catalog";

interface PopularServicesSectionProps {
  services: Service[];
}

/**
 * «01 · Каталог — Популярные услуги».
 * Desktop: сетка 4 колонки, 8 карточек. Промежуточные ширины: 2 колонки.
 * Mobile: горизонтальная лента из 5 карточек (как в Homepage-Mobile).
 */
export function PopularServicesSection({ services }: PopularServicesSectionProps) {
  return (
    <section aria-labelledby="popular-services-title">
      <Container className="pt-9 pb-2 md:pt-0 md:pb-[88px]">
        <SectionHeading
          id="popular-services-title"
          eyebrow="01 · Каталог"
          title="Популярные услуги"
          description="Запись открыта на все направления клиники."
          link={{ href: routes.services, label: "Все услуги и цены" }}
        />
        <ul className="scroll-row -mx-4 gap-3.5 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:p-0 xl:grid-cols-4">
          {services.map((service) => (
            // Mobile: ширина по содержимому, минимум 250px — как в макете
            <li
              key={service.id}
              className="max-w-[calc(100vw-32px)] min-w-[250px] shrink-0 max-md:nth-[n+6]:hidden md:max-w-none md:min-w-0"
            >
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
