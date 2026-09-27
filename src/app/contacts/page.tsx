import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MapPlaceholder } from "@/components/ui/MapPlaceholder";
import { PLACEHOLDER, telHref } from "@/lib/placeholders";
import { routes } from "@/lib/routes";
import { getClinicInfo } from "@/services/clinic";
import type { IconName } from "@/types/icon";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Адрес клиники и запись к врачу и на анализы онлайн.",
};

/**
 * «Контакты» (Cabinet-Contacts-*). FACT — один филиал, адрес (PROJECT_CONTEXT.md, 2.1).
 * Телефон и режим работы — UNKNOWN: показываются placeholder-ами, звонок недоступен.
 *
 * «Проложить маршрут» из макета не выводится: координаты филиала и город UNKNOWN,
 * а ссылка по одной улице может привести не туда. Появится вместе с картой.
 */
export default async function ContactsPage() {
  const clinic = await getClinicInfo();

  return (
    <Container className="pt-5 pb-6 md:pt-10 md:pb-14">
      <h1 className="text-[26px] leading-[33px] font-bold text-(--color-text-primary) md:text-[36px] md:leading-[44px]">
        Контакты
      </h1>
      <p className="mt-1.5 text-[14px] leading-5 text-(--color-text-secondary) md:mt-2 md:text-[16px] md:leading-6">
        <span className="md:hidden">Один филиал клиники.</span>
        <span className="hidden md:inline">Один филиал клиники — вся запись идёт через него.</span>
      </p>

      <div className="mt-5 flex flex-col gap-4 md:mt-8 lg:flex-row lg:items-start lg:gap-8">
        <MapPlaceholder label="Карта (заглушка)" className="h-[200px] md:h-[300px] lg:order-2 lg:h-[360px] lg:min-w-0 lg:flex-1" />

        <div className="lg:order-1 lg:w-[420px] lg:shrink-0">
          <address className="flex flex-col rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-4 py-1 not-italic shadow-(--shadow-s) md:px-7 md:py-2">
            <ContactRow icon="pin" label="Адрес" first>
              {clinic.address}
            </ContactRow>
            <ContactRow icon="phone" label="Телефон">
              {clinic.phone ? (
                <a href={telHref(clinic.phone)} className="hover:underline">
                  {clinic.phone}
                </a>
              ) : (
                PLACEHOLDER.phone
              )}
            </ContactRow>
            <ContactRow icon="clock" label="Режим работы">
              {clinic.workingHours ?? PLACEHOLDER.workingHours}
            </ContactRow>
          </address>

          <div className="mt-[18px] md:mt-5">
            <Button href={routes.booking} fullWidth className="md:w-auto">
              Записаться
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}

function ContactRow({
  icon,
  label,
  first = false,
  children,
}: {
  icon: IconName;
  label: string;
  first?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={
        first
          ? "flex items-start gap-3 py-3 md:gap-3.5 md:py-3.5"
          : "flex items-start gap-3 border-t border-(--color-border-decorative) py-3 md:gap-3.5 md:py-3.5"
      }
    >
      <span className="mt-0.5 flex text-(--color-icon-strong)">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-[12px] text-(--color-text-secondary) md:text-[13px]">{label}</p>
        <p className="mt-0.5 text-[15px] font-semibold text-(--color-text-primary) md:text-[16px]">{children}</p>
      </div>
    </div>
  );
}
