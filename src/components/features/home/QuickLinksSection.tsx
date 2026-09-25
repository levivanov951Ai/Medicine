import { Container } from "@/components/layout/Container";
import { ChipLink } from "@/components/ui/Chip";
import type { QuickLink } from "@/types/catalog";

interface QuickLinksSectionProps {
  links: QuickLink[];
}

/**
 * «Быстрый переход» — основные направления.
 * Desktop: подпись и чипы с переносом. Mobile: горизонтальная лента
 * с короткими подписями, заходящая под поля экрана.
 */
export function QuickLinksSection({ links }: QuickLinksSectionProps) {
  return (
    <nav aria-labelledby="quick-links-title">
      {/* pb-8 + pt-1 у ленты = 36px макета; pt-1 не даёт обрезать область нажатия чипов */}
      <Container className="pb-8 md:pb-14">
        <div className="md:flex md:flex-wrap md:items-center md:gap-5">
          <h2
            id="quick-links-title"
            className="sr-only text-[14px] font-semibold whitespace-nowrap text-(--color-text-secondary) md:not-sr-only"
          >
            Быстрый переход:
          </h2>
          <ul className="scroll-row -mx-4 gap-3.5 px-4 pt-1 pb-2 md:mx-0 md:flex-wrap md:gap-2.5 md:overflow-visible md:p-0">
            {links.map((link) => (
              <li key={link.id} className="shrink-0">
                <ChipLink href={link.href} icon={link.icon}>
                  {link.shortLabel ? (
                    <>
                      <span className="md:hidden">{link.shortLabel}</span>
                      <span className="hidden md:inline">{link.label}</span>
                    </>
                  ) : (
                    link.label
                  )}
                </ChipLink>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </nav>
  );
}
