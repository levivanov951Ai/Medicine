import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { formatDayMonth } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Promotion } from "@/types/catalog";

interface PromoCardProps {
  promotion: Promotion;
}

/**
 * Карточка акции — секция «Актуальные предложения» на главной.
 * Розовая подложка, бейдж «Акция», срок действия, ссылка «Подробнее».
 * Карточка для страницы «Акции» в Design System другая (белая) —
 * будет отдельным вариантом на следующем этапе.
 */
export function PromoCard({ promotion }: PromoCardProps) {
  const date = formatDayMonth(promotion.validUntil);

  return (
    <article className="flex h-full flex-col gap-3 rounded-[14px] border border-(--color-border-promo) bg-(--color-surface-promo-card) p-[18px] md:p-5">
      <Badge tone="promo" className="self-start">
        Акция
      </Badge>
      <h3 className="text-[15px] leading-[21px] font-bold text-(--color-text-primary) md:text-[16px] md:leading-[22px]">
        {promotion.title}
      </h3>
      <p className="text-[12px] text-(--color-text-secondary) md:text-[13px]">
        <span className="md:hidden">До {date}</span>
        <span className="hidden md:inline">Действует до {date}</span>
      </p>
      <Link
        href={routes.promotion(promotion.id)}
        className="mt-auto inline-flex items-center gap-1.5 self-start text-[15px] font-semibold text-(--color-text-link-strong) hover:underline"
      >
        Подробнее
        <span className="sr-only">: {promotion.title}</span>
        <Icon name="arrow-right" size={16} />
      </Link>
    </article>
  );
}
