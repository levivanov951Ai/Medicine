import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { PLACEHOLDER, telHref } from "@/lib/placeholders";
import type { ClinicInfo } from "@/types/clinic";
import type { IconName } from "@/types/icon";

interface ContactsSectionProps {
  clinic: ClinicInfo;
}

/**
 * «06 · Как добраться — Контакты» на сером фоне.
 * Карта — заглушка: интеграция с картой не входит в этот этап.
 * Телефон и режим работы — UNKNOWN, показываются placeholder-ами.
 */
export function ContactsSection({ clinic }: ContactsSectionProps) {
  return (
    <section aria-labelledby="contacts-title" className="bg-(--color-surface-page)">
      <Container className="py-9 md:py-16">
        <SectionHeading id="contacts-title" eyebrow="06 · Как добраться" title="Контакты" onTinted />

        <div className="lg:flex lg:gap-12">
          {/* Заглушка карты. Подпись — --color-text-secondary (6.76 на surface), см. CONTRAST_AUDIT.md */}
          <div
            aria-hidden="true"
            className="mb-5 flex h-[200px] items-center justify-center gap-2 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-page) text-[14px] text-(--color-text-secondary) md:h-[320px] lg:mb-0 lg:flex-1"
          >
            <Icon name="pin" size={20} />
            <span>Карта проезда</span>
          </div>

          <address className="flex flex-col not-italic lg:w-[360px] lg:shrink-0 lg:gap-[22px]">
            <ContactItem icon="pin" title="Адрес">
              {clinic.address}
            </ContactItem>
            <ContactItem icon="phone" title="Телефон">
              {clinic.phone ? (
                <a href={telHref(clinic.phone)} className="hover:underline">
                  {clinic.phone}
                </a>
              ) : (
                PLACEHOLDER.phone
              )}
            </ContactItem>
            <ContactItem icon="clock" title="Режим работы">
              {clinic.workingHours ?? PLACEHOLDER.workingHours}
            </ContactItem>
          </address>
        </div>
      </Container>
    </section>
  );
}

interface ContactItemProps {
  icon: IconName;
  title: string;
  children: ReactNode;
}

function ContactItem({ icon, title, children }: ContactItemProps) {
  return (
    <div className="flex items-start gap-3 border-t border-(--color-border-decorative) py-3.5 lg:gap-3.5 lg:border-t-0 lg:py-0">
      <span className="mt-0.5 flex text-(--color-icon-strong)">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-[15px] font-bold text-(--color-text-primary) lg:text-[16px]">{title}</p>
        <p className="mt-0.5 text-[14px] text-(--color-text-secondary) lg:text-[15px]">{children}</p>
      </div>
    </div>
  );
}
