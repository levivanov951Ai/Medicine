import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContentSectionProps {
  title: string;
  /** id заголовка — для aria-labelledby. */
  id: string;
  className?: string;
  children: ReactNode;
}

/**
 * Раздел страницы услуги, врача или анализа: H2 и содержимое
 * («Об услуге», «Подготовка», «Стоимость»…). Отступы — Service-*, DoctorProfile-*.
 */
export function ContentSection({ title, id, className, children }: ContentSectionProps) {
  return (
    <section aria-labelledby={id} className={cn("pb-8 md:pb-14", className)}>
      <h2
        id={id}
        className="mb-3 text-[24px] leading-8 font-bold text-(--color-text-primary) md:mb-4 md:text-[32px] md:leading-10"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
