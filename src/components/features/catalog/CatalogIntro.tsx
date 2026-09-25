import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface CatalogIntroProps {
  eyebrow: string;
  title: string;
  /** Пояснение: в Design v1 у desktop и mobile разные тексты. */
  lead: { desktop: string; mobile: string };
  /** Поле поиска. */
  search: ReactNode;
}

/** Шапка каталога: eyebrow, H1, пояснение и поиск (Catalog-*, Doctors-*, Analyses-*). */
export function CatalogIntro({ eyebrow, title, lead, search }: CatalogIntroProps) {
  return (
    <Container className="pt-5 pb-5 md:pt-14 md:pb-10">
      <div className="flex max-w-[760px] flex-col gap-2.5 md:gap-4">
        <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">{eyebrow}</p>
        <h1 className="text-[30px] leading-[38px] font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
          {title}
        </h1>
        <p className="text-[16px] leading-6 text-(--color-text-secondary) md:text-[18px] md:leading-7">
          <span className="md:hidden">{lead.mobile}</span>
          <span className="hidden md:inline">{lead.desktop}</span>
        </p>
        <div className="mt-2.5 md:mt-0 md:max-w-[640px]">{search}</div>
      </div>
    </Container>
  );
}
