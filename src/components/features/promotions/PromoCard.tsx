import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { formatDayMonth } from "@/lib/format";
import type { PromotionItem } from "@/services/promotions";
import type { IconName } from "@/types/icon";

interface PromoCardProps {
  item: PromotionItem;
  /**
   * home — розовая карточка секции «Актуальные предложения» на главной;
   * list — белая карточка страницы «Акции» (Design System, Promo Card; Cabinet-Promos-*).
   */
  variant?: "home" | "list";
  /** Уровень заголовка: h3 на главной (под h2 секции), h2 на странице «Акции». */
  headingLevel?: "h2" | "h3";
}

const targetIcons: Record<PromotionItem["targetKind"], IconName> = {
  service: "stethoscope",
  analysis: "flask",
  package: "layers",
};

/**
 * Карточка акции: бейдж «Акция», название, срок действия, ссылка на то,
 * к чему акция относится (услуга, анализ или программа — PD-13).
 * Отдельной страницы акции в Design v1 нет.
 */
export function PromoCard({ item, variant = "home", headingLevel = "h3" }: PromoCardProps) {
  const { promotion, href, targetKind } = item;
  const Heading = headingLevel;
  const date = promotion.validUntil ? formatDayMonth(promotion.validUntil) : null;

  if (variant === "list") {
    return (
      <article className="flex h-full flex-col gap-3 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-[18px] shadow-(--shadow-s) md:p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-(--radius-m) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)">
            <Icon name={targetIcons[targetKind]} size={22} />
          </span>
          <Badge tone="promo">Акция</Badge>
        </div>
        <Heading className="text-[16px] leading-[22px] font-bold text-(--color-text-primary) md:text-[17px] md:leading-6">
          {promotion.title}
        </Heading>
        <p className="text-[14px] leading-5 text-(--color-text-secondary)">{promotion.description}</p>
        {/* В макете срок — ink-400 (3.01); используется --color-text-secondary (решение F, CONTRAST_AUDIT.md). */}
        <p className="text-[12px] text-(--color-text-secondary) md:mt-0.5">
          {date ? `Действует до ${date}` : "Без даты окончания"}
        </p>
        {href && <MoreLink href={href} label="Узнать больше" title={promotion.title} className="mt-auto text-[14px]" />}
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col gap-3 rounded-[14px] border border-(--color-border-promo) bg-(--color-surface-promo-card) p-[18px] md:p-5">
      <Badge tone="promo" className="self-start">
        Акция
      </Badge>
      <Heading className="text-[15px] leading-[21px] font-bold text-(--color-text-primary) md:text-[16px] md:leading-[22px]">
        {promotion.title}
      </Heading>
      {date && (
        <p className="text-[12px] text-(--color-text-secondary) md:text-[13px]">
          <span className="md:hidden">До {date}</span>
          <span className="hidden md:inline">Действует до {date}</span>
        </p>
      )}
      {href && <MoreLink href={href} label="Подробнее" title={promotion.title} className="mt-auto text-[15px]" />}
    </article>
  );
}

function MoreLink({ href, label, title, className }: { href: string; label: string; title: string; className: string }) {
  return (
    <Link
      href={href}
      className={`touch-target inline-flex items-center gap-1.5 self-start rounded-(--radius-s) font-semibold text-(--color-text-link-strong) hover:underline ${className}`}
    >
      {label}
      <span className="sr-only">: {title}</span>
      <Icon name="arrow-right" size={16} />
    </Link>
  );
}
