import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DoctorCard } from "@/components/features/doctors/DoctorCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipLink } from "@/components/ui/Chip";
import { CheckList, StepList } from "@/components/ui/CheckList";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Price } from "@/components/ui/Price";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { formatRub } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getServicePage } from "@/services/services-catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getServicePage((await params).id);
  if (!data) return {};
  return { title: data.service.title, description: data.service.summary };
}

const MAIN_CTA_ID = "service-booking";

/**
 * Страница услуги — Service-Desktop / Service-Mobile.
 * «Записаться» передаёт услугу в запись: мастер стартует с шага «Врач» (PD-03).
 * «Записаться» у врача — услуга и врач уже выбраны, остаются дата и время.
 */
export default async function ServicePage({ params }: PageProps) {
  const data = await getServicePage((await params).id);
  if (!data) notFound();

  const { service, category, doctors, related } = data;
  const bookingHref = routes.bookingWithService(service.id);
  const hasDiscount = service.price.oldAmount !== undefined;
  // Подсказка про цену — только если у врачей она действительно отличается.
  const priceDependsOnDoctor = doctors.some(({ price }) => price.amount !== service.price.amount);
  const categoryIcon = category?.icon ?? "stethoscope";

  const crumbs = [
    { label: "Услуги и цены", href: routes.services },
    ...(category ? [{ label: category.label, href: routes.servicesCatalog({ category: category.id }) }] : []),
  ];

  return (
    <div>
      <Container className="pt-5 pb-5 md:pt-10 md:pb-14 lg:pb-[72px]">
        <Breadcrumbs items={crumbs} current={service.title} />
        <div className="mt-4 md:mt-7 lg:flex lg:items-start lg:justify-between lg:gap-16">
          <div className="flex flex-col gap-3.5 md:gap-5 lg:max-w-[560px]">
            {category && (
              <ChipLink href={routes.servicesCatalog({ category: category.id })} icon={category.icon} className="self-start">
                {category.label}
              </ChipLink>
            )}
            <h1 className="text-[30px] leading-[38px] font-bold break-words text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
              {service.title}
            </h1>
            {service.summary && (
              <p className="text-[17px] leading-[26px] text-(--color-text-secondary) md:text-[18px] md:leading-7">
                {service.summary}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <Price price={service.price} />
              {hasDiscount && <Badge tone="promo">Акция</Badge>}
              {priceDependsOnDoctor && (
                <span className="text-[13px] text-(--color-text-secondary) md:text-[14px]">
                  <span className="md:hidden">зависит от врача</span>
                  <span className="hidden md:inline">точная стоимость зависит от врача</span>
                </span>
              )}
            </div>
            <MediaPlaceholder
              label="Фото приёма"
              icon={categoryIcon}
              iconSize={56}
              compactLabel
              className="mt-1.5 h-[200px] w-full rounded-(--radius-l) md:h-[280px] lg:hidden"
            />
            <div id={MAIN_CTA_ID} className="mt-1.5 md:mt-0">
              <Button href={bookingHref} size="md" className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]">
                Записаться
              </Button>
            </div>
          </div>
          <MediaPlaceholder
            label="Фото приёма"
            icon={categoryIcon}
            iconSize={88}
            className="hidden h-[420px] max-w-[480px] flex-1 rounded-[20px] lg:flex"
          />
        </div>
      </Container>

      <Container>
        {service.description && (
          <ContentSection id="about-title" title="Об услуге">
            <p className="max-w-[820px] text-[16px] leading-6 text-(--color-text-secondary) md:text-[17px] md:leading-[26px]">
              {service.description}
            </p>
          </ContentSection>
        )}
        {service.indications && (
          <ContentSection id="indications-title" title="Когда может быть назначена">
            <CheckList items={service.indications} />
          </ContentSection>
        )}
        {service.steps && (
          <ContentSection id="steps-title" title="Как проходит приём">
            <StepList items={service.steps} />
          </ContentSection>
        )}
        {service.preparation && (
          <ContentSection id="preparation-title" title="Подготовка">
            <p className="max-w-[640px] text-[15px] leading-[22px] text-(--color-text-secondary) md:text-[16px] md:leading-6">
              {service.preparation}
            </p>
          </ContentSection>
        )}
        <ContentSection id="price-title" title="Стоимость">
          <div className="flex max-w-[640px] flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[14px] border border-(--color-border-decorative) px-[18px] py-4 md:px-[22px] md:py-[18px]">
            <p className="text-[15px] font-semibold text-(--color-text-primary) md:text-[16px]">{service.title}</p>
            <Price price={service.price} />
          </div>
          {priceDependsOnDoctor && (
            <p className="mt-2.5 max-w-[640px] text-[13px] text-(--color-text-secondary)">
              Точная стоимость зависит от врача и указана на его карточке ниже.
            </p>
          )}
        </ContentSection>
      </Container>

      {doctors.length > 0 && (
        <section aria-labelledby="service-doctors-title" className="bg-(--color-surface-page)">
          <Container className="pt-7 pb-8 md:pt-12 md:pb-16">
            <div className="mb-[18px] md:mb-7">
              <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent-on-tinted) uppercase">
                Врачи
              </p>
              <h2
                id="service-doctors-title"
                className="mt-1.5 text-[22px] leading-7 font-bold text-(--color-text-primary) md:text-[32px] md:leading-10"
              >
                Кто ведёт приём
              </h2>
              <p className="mt-2 hidden text-[16px] leading-6 text-(--color-text-secondary) md:block">
                Нажмите «Записаться» у врача — услуга уже выбрана, дальше только дата и время.
              </p>
            </div>
            <ul className="scroll-row -mx-4 gap-2.5 px-4 pb-2 md:mx-0 md:gap-5 md:px-0">
              {doctors.map(({ doctor, price }) => (
                <li key={doctor.id} className="shrink-0">
                  <DoctorCard doctor={doctor} serviceContext={{ serviceId: service.id, price }} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <Container className="pt-8 pb-7 md:pt-12 md:pb-14">
          <section aria-labelledby="related-title">
            <h2
              id="related-title"
              className="mb-3.5 text-[12px] font-bold tracking-[.05em] text-(--color-text-secondary) uppercase md:text-[13px]"
            >
              Связанные услуги
            </h2>
            <ul className="flex flex-col md:flex-row md:flex-wrap md:gap-3">
              {related.map(({ service: item }) => (
                <li key={item.id}>
                  <Link
                    href={routes.service(item.id)}
                    className="flex min-h-11 items-center justify-between gap-2 border-t border-(--color-border-decorative) px-1 py-3 text-[14px] font-semibold text-(--color-text-primary) hover:text-(--color-text-link-strong) md:rounded-(--radius-pill) md:border md:px-4 md:py-2.5"
                  >
                    {item.title}
                    <span className="flex text-(--color-icon-muted)">
                      <Icon name="chevron-right" size={14} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}

      <StickyActionBar
        watchId={MAIN_CTA_ID}
        title={service.title}
        subtitle={`${service.price.isFrom ? "от " : ""}${formatRub(service.price.amount)}`}
        action={
          <Button href={bookingHref} size="md">
            Записаться
          </Button>
        }
      />
    </div>
  );
}
