import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceRow } from "@/components/features/services/ServiceRow";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { Button } from "@/components/ui/Button";
import { ChipLabel } from "@/components/ui/Chip";
import { CheckList } from "@/components/ui/CheckList";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Price } from "@/components/ui/Price";
import { StickyActionBar } from "@/components/ui/StickyActionBar";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { getDoctorPage } from "@/services/doctors";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getDoctorPage((await params).id);
  if (!data) return {};
  const { doctor } = data;
  return { title: `${doctor.name} — ${doctor.specialty}`, description: doctor.bio };
}

const MAIN_CTA_ID = "doctor-booking";

/** «Сегодня, 14:20» → «сегодня, 14:20» — внутри фразы. */
const lowerFirst = (text: string) => text.charAt(0).toLocaleLowerCase("ru-RU") + text.slice(1);

/**
 * Страница врача — DoctorProfile-Desktop / DoctorProfile-Mobile.
 * Данные — тот же врач из канонического набора, что на главной и в каталоге (PD-25).
 *
 * «Записаться» — врач уже выбран, мастер стартует с шага «Услуга».
 * «Записаться» у услуги — выбраны и врач, и услуга: сразу «Дата и время» (PD-03).
 */
export default async function DoctorPage({ params }: PageProps) {
  const data = await getDoctorPage((await params).id);
  if (!data) notFound();

  const { doctor, category, services } = data;
  const bookingHref = routes.bookingWithDoctor(doctor.id);
  const specialties = [doctor.specialty, ...(doctor.additionalSpecialties ?? [])];
  const experience = `Стаж ${countLabel(doctor.experienceYears, WORDS.year)}`;
  const nextSlot = lowerFirst(doctor.nextSlotLabel);

  const crumbs = [
    { label: "Врачи", href: routes.doctors },
    ...(category ? [{ label: category.label, href: routes.doctorsCatalog({ category: category.id }) }] : []),
  ];

  return (
    <div>
      <Container className="pt-5 pb-8 md:pt-10 md:pb-14 lg:pb-[72px]">
        <Breadcrumbs items={crumbs} current={doctor.name} />
        <div className="mt-3.5 md:mt-7 lg:flex lg:items-start lg:gap-14">
          <MediaPlaceholder
            label="Фото врача"
            icon="user"
            iconSize={72}
            compactLabel
            className="h-[260px] w-full rounded-(--radius-l) md:h-[360px] lg:hidden"
          />
          <MediaPlaceholder
            label="Фото врача"
            icon="user"
            iconSize={96}
            className="hidden h-[460px] w-[420px] rounded-[20px] lg:flex"
          />
          <div className="mt-5 flex flex-col lg:mt-0 lg:max-w-[520px] lg:gap-4">
            <ul className="flex flex-wrap gap-2" aria-label="Специализация">
              {specialties.map((specialty) => (
                <li key={specialty}>
                  <ChipLabel>{specialty}</ChipLabel>
                </li>
              ))}
            </ul>
            <h1 className="mt-3.5 text-[30px] leading-[38px] font-bold break-words text-(--color-text-primary) md:text-[44px] md:leading-[52px] lg:mt-0">
              {doctor.name}
            </h1>
            <p className="mt-2.5 flex items-center gap-2 text-[14px] text-(--color-text-secondary) md:text-[15px] lg:mt-0">
              <Icon name="briefcase" size={18} className="size-4 md:size-[18px]" />
              {experience}
            </p>
            <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 lg:mt-0">
              <Price price={doctor.price} size="lg" />
              {doctor.appointmentDuration && (
                <span className="text-[13px] text-(--color-text-secondary) md:text-[14px]">
                  приём длится {doctor.appointmentDuration}
                </span>
              )}
            </div>
            <p className="mt-2 flex items-center gap-2 text-[14px] font-semibold text-(--color-text-primary) md:text-[15px] lg:mt-0">
              <span className="flex text-(--color-icon-strong)">
                <Icon name="clock" size={18} className="size-4 md:size-[18px]" />
              </span>
              Ближайшее время: {nextSlot}
            </p>
            <div id={MAIN_CTA_ID} className="mt-5 lg:mt-0">
              <Button href={bookingHref} size="md" className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]">
                Записаться
              </Button>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        {doctor.bio && (
          <ContentSection id="bio-title" title="О враче">
            <p className="max-w-[760px] text-[16px] leading-6 text-(--color-text-secondary) md:text-[17px] md:leading-[26px]">
              {doctor.bio}
            </p>
          </ContentSection>
        )}
        {doctor.focusAreas && (
          <ContentSection id="focus-title" title="Направления работы">
            <ul className="flex flex-wrap gap-2.5">
              {doctor.focusAreas.map((area) => (
                <li key={area}>
                  <ChipLabel>{area}</ChipLabel>
                </li>
              ))}
            </ul>
          </ContentSection>
        )}
        {doctor.education && doctor.education.length > 0 && (
          <ContentSection id="education-title" title="Образование">
            <CheckList items={doctor.education} />
          </ContentSection>
        )}
        {doctor.experienceNote && (
          <ContentSection id="experience-title" title="Опыт">
            <p className="max-w-[640px] text-[15px] leading-[22px] text-(--color-text-secondary) md:text-[16px] md:leading-6">
              {doctor.experienceNote}
            </p>
          </ContentSection>
        )}
      </Container>

      {services.length > 0 && (
        <section aria-labelledby="doctor-services-title" className="bg-(--color-surface-page)">
          <Container className="pt-7 pb-8 md:pt-12 md:pb-16">
            <h2
              id="doctor-services-title"
              className="mb-3 text-[24px] leading-8 font-bold text-(--color-text-primary) md:mb-4 md:text-[32px] md:leading-10"
            >
              Услуги врача
            </h2>
            <ul className="max-w-[820px]">
              {services.map(({ service, price }) => (
                <li key={service.id}>
                  <ServiceRow
                    variant="compact"
                    title={service.title}
                    price={price}
                    bookingHref={routes.bookingWithServiceAndDoctor(service.id, doctor.id)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-2.5 max-w-[820px] text-[12px] text-(--color-text-secondary) md:mt-3 md:text-[13px]">
              <span className="md:hidden">Кнопка у услуги сразу выбирает и врача, и услугу.</span>
              <span className="hidden md:inline">
                Нажимая «Записаться» у конкретной услуги, вы выбираете и врача, и услугу — дальше только дата и время.
              </span>
            </p>
          </Container>
        </section>
      )}

      <StickyActionBar
        watchId={MAIN_CTA_ID}
        title={`${doctor.name} · ${doctor.specialty}`}
        subtitle={`от ${formatRub(doctor.price.amount)} · ${nextSlot}`}
        action={
          <Button href={bookingHref} size="md">
            Записаться
          </Button>
        }
      />
    </div>
  );
}
