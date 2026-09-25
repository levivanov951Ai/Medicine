import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { cn } from "@/lib/cn";
import type { Price as PriceValue } from "@/types/catalog";

interface ServiceRowProps {
  title: string;
  price: PriceValue;
  /** Запись: со страницы каталога — с услугой, из профиля врача — с услугой и врачом. */
  bookingHref: string;
  /** Страница услуги. Без неё ссылка «Подробнее» не выводится (профиль врача). */
  detailsHref?: string;
  /**
   * catalog — «Услуги и цены» (Catalog-*.dc.html): колонка цены 150px с «от»;
   * compact — «Услуги врача» (DoctorProfile-*.dc.html): цена 120px, без «Подробнее».
   */
  variant?: "catalog" | "compact";
}

/**
 * Строка услуги в списке с разделителями.
 * Desktop (с 768px): одна строка — название, цена, «Подробнее», «Записаться».
 * Mobile: название сверху, под ним цена и действия.
 * Со скидкой — метка «Акция» рядом с названием, как в строке анализа.
 */
export function ServiceRow({ title, price, bookingHref, detailsHref, variant = "catalog" }: ServiceRowProps) {
  const compact = variant === "compact";
  const hasDiscount = price.oldAmount !== undefined;

  return (
    <article
      className={cn(
        "flex flex-col border-t border-(--color-border-decorative) md:flex-row md:items-center md:gap-5 md:px-1",
        compact ? "gap-2.5 py-3.5 md:py-4" : "gap-2.5 py-4 md:py-[18px]",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2.5 gap-y-1">
        <h3
          className={cn(
            "font-semibold break-words text-(--color-text-primary)",
            compact ? "text-[15px] md:text-[16px]" : "text-[16px] leading-[22px]",
          )}
        >
          {title}
        </h3>
        {hasDiscount && (
          <Badge tone="promo" size="sm">
            Акция
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 md:contents">
        <Price
          price={price}
          size={compact ? "sm" : "md"}
          fromColumn={!compact}
          className={cn("md:shrink-0", compact ? "md:w-[120px]" : "md:w-[150px]")}
        />
        <div className="flex items-center gap-3.5 md:contents">
          {detailsHref && (
            <Link
              href={detailsHref}
              className="touch-target inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-s) py-2 text-[15px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline"
            >
              Подробнее
              <span className="sr-only">: {title}</span>
              <Icon name="chevron-right" size={16} />
            </Link>
          )}
          <Button href={bookingHref} variant="secondary" size="sm" className="shrink-0">
            Записаться
            <span className="sr-only">: {title}</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
