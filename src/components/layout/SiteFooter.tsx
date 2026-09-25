import Link from "next/link";
import { legalNav, mainNav } from "@/lib/navigation";
import { PLACEHOLDER } from "@/lib/placeholders";
import type { ClinicInfo } from "@/types/clinic";
import { Container } from "./Container";
import { Logo } from "./Logo";

interface SiteFooterProps {
  clinic: ClinicInfo;
}

const TAGLINE = "Запись к врачу и на анализы онлайн, без звонка в регистратуру.";
const DISCLAIMER = "Сайт не заменяет очную консультацию врача.";

/**
 * Единый подвал сайта (Design-System.dc.html, «Footer»).
 * Подключается один раз в корневом layout — локальных копий на страницах нет.
 * Desktop (≥1024): бренд слева, три колонки справа.
 * Mobile: вертикальный стек, ссылки с областью нажатия 44px.
 */
export function SiteFooter({ clinic }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const phone = clinic.phone ?? PLACEHOLDER.phone;
  const hours = clinic.workingHours ?? PLACEHOLDER.workingHours;
  const copyright = `© ${year} ${clinic.name}. Все права защищены.`;

  return (
    <footer className="bg-(--color-surface-inverse) text-(--color-text-on-inverse-secondary)">
      {/* Mobile и промежуточные ширины */}
      <Container className="flex flex-col gap-2 pt-9 pb-8 lg:hidden">
        <Logo name={clinic.name} tone="inverse" />
        <p className="mt-3 mb-1 text-[14px] leading-5">{TAGLINE}</p>

        <nav aria-label="Навигация в подвале">
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center border-t border-(--color-border-on-inverse) py-2.5 text-[14px] hover:text-(--color-text-on-inverse)"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Правовая информация" className="mt-3">
          <ul className="flex flex-col">
            {legalNav.map((item) => (
              <li key={item.slug}>
                {/* В макете 30px по высоте; увеличено до 44px — требование к области нажатия */}
                <Link
                  href={item.href}
                  className="flex min-h-11 items-center text-[13px] text-(--color-text-on-inverse-tertiary) hover:text-(--color-text-on-inverse)"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mt-5 border-t border-(--color-border-on-inverse) pt-5 text-[12px] text-(--color-text-on-inverse-tertiary)">
          {clinic.address} · {phone}
        </p>
        <p className="mt-2 text-[12px] text-(--color-text-on-inverse-tertiary)">{copyright}</p>
      </Container>

      {/* Desktop */}
      <div className="hidden lg:block">
        <Container className="flex justify-between gap-12 pt-16 pb-8">
          <div className="flex max-w-[320px] flex-col gap-4">
            <Logo name={clinic.name} tone="inverse" />
            <p className="text-[14px] leading-5">{TAGLINE}</p>
          </div>

          <div className="flex gap-12 xl:gap-20">
            <nav aria-label="Навигация в подвале" className="flex flex-col gap-3.5">
              <h2 className="text-[14px] font-bold text-(--color-text-on-inverse)">Навигация</h2>
              <ul className="flex flex-col gap-3.5 text-[14px]">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-[14px] hover:text-(--color-text-on-inverse) hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Правовая информация" className="flex flex-col gap-3.5">
              <h2 className="text-[14px] font-bold text-(--color-text-on-inverse)">Правовая информация</h2>
              <ul className="flex flex-col gap-3.5 text-[14px]">
                {legalNav.map((item) => (
                  <li key={item.slug}>
                    <Link href={item.href} className="text-[14px] hover:text-(--color-text-on-inverse) hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex flex-col gap-3.5">
              <h2 className="text-[14px] font-bold text-(--color-text-on-inverse)">Контакты</h2>
              <address className="flex flex-col gap-3.5 text-[14px] not-italic">
                <span>{clinic.address}</span>
                <span>{phone}</span>
                <span>{hours}</span>
              </address>
            </div>
          </div>
        </Container>

        <div className="border-t border-(--color-border-on-inverse)">
          <Container className="flex justify-between gap-6 py-5 text-[13px] text-(--color-text-on-inverse-tertiary)">
            <p>{copyright}</p>
            <p>{DISCLAIMER}</p>
          </Container>
        </div>
      </div>
    </footer>
  );
}
