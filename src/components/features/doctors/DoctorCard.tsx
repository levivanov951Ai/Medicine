import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChipLabel } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/cn";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { Doctor, Price as PriceValue } from "@/types/catalog";

interface DoctorCardProps {
  doctor: Doctor;
  /**
   * teaser — лента карточек: главная, «Кто ведёт приём» на странице услуги;
   * catalog — каталог «Врачи» (Doctors-*.dc.html).
   */
  variant?: "teaser" | "catalog";
  /**
   * Контекст услуги (страница услуги): цена врача за эту услугу, стаж
   * в строке специальности и запись сразу с услугой и врачом.
   */
  serviceContext?: { serviceId: string; price: PriceValue };
}

/**
 * Карточка врача. Все данные — из канонического набора (PD-25):
 * ФИО, специальность, цена и ближайшее время везде одинаковые.
 * Фото — заглушка: реальных фото нет (UNKNOWN).
 * Длинные ФИО переносятся, карточка растёт по высоте (handoff, раздел 3).
 */
export function DoctorCard({ doctor, variant = "teaser", serviceContext }: DoctorCardProps) {
  return variant === "catalog" ? (
    <CatalogCard doctor={doctor} />
  ) : (
    <TeaserCard doctor={doctor} serviceContext={serviceContext} />
  );
}

function experienceLabel(doctor: Doctor) {
  return `стаж ${countLabel(doctor.experienceYears, WORDS.year)}`;
}

function NextSlot({ label, className }: { label: string; className?: string }) {
  return (
    <p className={className}>
      <Icon name="clock" size={15} className="size-[13px] md:size-[15px]" />
      <span className="sr-only">Ближайшее время: </span>
      {label}
    </p>
  );
}

/** Имя — ссылка на страницу врача; вид заголовка не меняется. */
function DoctorName({ doctor, className }: { doctor: Doctor; className: string }) {
  return (
    <h3 className={className}>
      <Link href={routes.doctor(doctor.id)} className="rounded-(--radius-s) hover:underline">
        {doctor.name}
      </Link>
    </h3>
  );
}

/**
 * Лента на главной (Homepage-*) и на странице услуги (Service-*).
 * Desktop: 270–280px, фото 180px. Mobile: 230px, фото 150px.
 */
function TeaserCard({ doctor, serviceContext }: Omit<DoctorCardProps, "variant">) {
  const bookingHref = serviceContext
    ? routes.bookingWithServiceAndDoctor(serviceContext.serviceId, doctor.id)
    : routes.bookingWithDoctor(doctor.id);

  return (
    // Ширина по содержимому (минимум как в макете), ограничена — длинные ФИО переносятся
    <article className="flex h-full max-w-[min(calc(100vw-32px),360px)] min-w-[230px] flex-col overflow-hidden rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) shadow-(--shadow-m) md:min-w-[270px]">
      <MediaPlaceholder label="Фото" icon="user" iconSize={44} compactLabel className="h-[150px] w-full md:hidden" />
      <MediaPlaceholder label="Фото врача" icon="user" iconSize={56} className="hidden h-[180px] w-full md:flex" />
      <div className="flex flex-1 flex-col gap-2 p-4 md:gap-2.5 md:p-5">
        <div>
          <DoctorName
            doctor={doctor}
            className="text-[15px] font-bold break-words text-(--color-text-primary) md:text-[17px]"
          />
          <p
            className={cn(
              "mt-0.5 text-(--color-text-secondary) md:text-[14px]",
              serviceContext ? "text-[12px]" : "text-[13px]",
            )}
          >
            {doctor.specialty}
            {serviceContext && ` · ${experienceLabel(doctor)}`}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Price price={serviceContext?.price ?? doctor.price} />
          <NextSlot
            label={doctor.nextSlotLabel}
            className="flex items-center gap-[5px] text-[12px] text-(--color-text-secondary) md:gap-1.5 md:text-[13px]"
          />
        </div>
        <Button href={bookingHref} variant="secondary" size="sm" fullWidth>
          Записаться
          <span className="sr-only">: {doctor.name}</span>
        </Button>
      </div>
    </article>
  );
}

/**
 * Каталог «Врачи». Desktop (с 768px): вертикальная карточка, фото 200px.
 * Mobile: горизонтальная — фото 120px слева, данные справа.
 */
function CatalogCard({ doctor }: { doctor: Doctor }) {
  return (
    <article className="flex h-full gap-4 overflow-hidden rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) shadow-(--shadow-m) md:flex-col md:gap-0">
      <MediaPlaceholder
        label="Фото"
        icon="user"
        iconSize={40}
        compactLabel
        className="min-h-[176px] w-[120px] self-stretch border-y-0 border-l-0 md:hidden"
      />
      <MediaPlaceholder
        label="Фото врача"
        icon="user"
        iconSize={56}
        compactLabel
        className="hidden h-[200px] w-full border-x-0 border-t-0 md:flex"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 py-4 pr-4 md:gap-2.5 md:p-[22px]">
        <div className="md:min-h-[52px]">
          <DoctorName
            doctor={doctor}
            className="text-[16px] leading-[22px] font-bold break-words text-(--color-text-primary) md:text-[18px] md:leading-6"
          />
          <p className="mt-0.5 text-[13px] text-(--color-text-secondary) md:mt-1 md:text-[14px]">{doctor.specialty}</p>
          {doctor.additionalSpecialties && (
            <ul className="mt-1 flex flex-wrap gap-1.5">
              {doctor.additionalSpecialties.map((specialty) => (
                <li key={specialty}>
                  <ChipLabel multiline>{specialty}</ChipLabel>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="flex items-center gap-1.5 text-[12px] text-(--color-text-secondary) md:text-[13px]">
          <Icon name="briefcase" size={15} className="size-[13px] md:size-[15px]" />
          Стаж {countLabel(doctor.experienceYears, WORDS.year)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <Price price={doctor.price} />
          <NextSlot
            label={doctor.nextSlotLabel}
            className="flex items-center gap-[5px] text-[12px] text-(--color-text-secondary) md:gap-1.5 md:text-[13px]"
          />
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-2 md:mt-1 md:gap-x-3">
          <Link
            href={routes.doctor(doctor.id)}
            className="touch-target inline-flex items-center gap-1.5 rounded-(--radius-s) py-2 text-[15px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline"
          >
            Подробнее
            <span className="sr-only">: {doctor.name}</span>
            {/* На 390px шеврон не помещается рядом с «Записаться» — действия уходили в две строки */}
            <span className="hidden md:flex">
              <Icon name="chevron-right" size={16} />
            </span>
          </Link>
          <Button href={routes.bookingWithDoctor(doctor.id)} variant="secondary" size="sm">
            Записаться
            <span className="sr-only">: {doctor.name}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
