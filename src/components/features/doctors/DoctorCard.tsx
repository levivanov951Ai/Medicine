import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Price } from "@/components/ui/Price";
import { routes } from "@/lib/routes";
import type { Doctor } from "@/types/catalog";

interface DoctorCardProps {
  doctor: Doctor;
}

/**
 * Карточка врача — тизер главной (Homepage-Desktop / Mobile, секция «Врачи»).
 * Desktop: 270px, фото 180px. Mobile: 230px, фото 150px.
 * Фото — заглушка: реальных фото нет (UNKNOWN).
 * Длинные ФИО переносятся, карточка растёт по высоте (handoff, раздел 3).
 */
export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    // Ширина по содержимому (минимум как в макете), ограничена — длинные ФИО переносятся
    <article className="flex h-full max-w-[min(calc(100vw-32px),360px)] min-w-[230px] flex-col overflow-hidden rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) shadow-(--shadow-m) md:min-w-[270px]">
      <MediaPlaceholder
        label="Фото"
        icon="user"
        iconSize={44}
        compactLabel
        className="h-[150px] w-full md:hidden"
      />
      <MediaPlaceholder
        label="Фото врача"
        icon="user"
        iconSize={56}
        className="hidden h-[180px] w-full md:flex"
      />

      <div className="flex flex-1 flex-col gap-2 p-4 md:gap-2.5 md:p-5">
        <div>
          <h3 className="text-[15px] font-bold break-words text-(--color-text-primary) md:text-[17px]">
            {doctor.name}
          </h3>
          <p className="mt-0.5 text-[13px] text-(--color-text-secondary) md:text-[14px]">{doctor.specialty}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-y-1">
          <Price price={doctor.price} />
          <p className="flex items-center gap-[5px] text-[12px] text-(--color-text-secondary) md:gap-1.5 md:text-[13px]">
            <Icon name="clock" size={15} className="size-[13px] md:size-[15px]" />
            <span className="sr-only">Ближайшее время: </span>
            {doctor.nextSlotLabel}
          </p>
        </div>

        <Button href={routes.bookingWithDoctor(doctor.id)} variant="secondary" size="sm" fullWidth>
          Записаться
          <span className="sr-only">: {doctor.name}</span>
        </Button>
      </div>
    </article>
  );
}
