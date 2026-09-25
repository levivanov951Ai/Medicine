import { Button } from "@/components/ui/Button";
import { ChipLabel } from "@/components/ui/Chip";
import { Price } from "@/components/ui/Price";
import { routes } from "@/lib/routes";
import type { Service } from "@/types/catalog";

interface ServiceCardProps {
  service: Service;
}

/**
 * Карточка услуги — секция «Популярные услуги» на главной.
 * В handoff этот элемент главной назван «Service Row», но в макете
 * главной это вертикальная карточка. Строчный вариант для каталога —
 * ServiceRow.tsx.
 *
 * «Записаться» передаёт услугу в мастер записи: он стартует
 * с шага «Врач» (PD-03).
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex h-full flex-col gap-3.5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-[22px] shadow-(--shadow-m) md:gap-4 md:p-7">
      <ChipLabel className="self-start">{service.categoryLabel}</ChipLabel>

      <h3 className="min-h-[44px] text-[16px] leading-[22px] font-bold text-(--color-text-primary) md:min-h-[50px] md:text-[18px] md:leading-[25px]">
        {service.title}
      </h3>

      {/* Кнопка не переносится: при нехватке места старая цена уходит под новую (как в макете) */}
      <div className="mt-auto flex items-center justify-between gap-3">
        <Price price={service.price} className="min-w-0" />
        <Button href={routes.bookingWithService(service.id)} variant="secondary" size="sm">
          Записаться
          <span className="sr-only">: {service.title}</span>
        </Button>
      </div>
    </article>
  );
}
