import { cn } from "@/lib/cn";
import { formatRub } from "@/lib/format";
import type { Price as PriceValue } from "@/types/catalog";

interface PriceProps {
  price: PriceValue;
  className?: string;
}

/**
 * Цена Design v1: обычная, со скидкой (старая — зачёркнута), «от».
 * Скринридер получает словесную расшифровку, т. к. зачёркивание не озвучивается.
 */
export function Price({ price, className }: PriceProps) {
  const { amount, oldAmount, isFrom } = price;

  if (oldAmount !== undefined) {
    return (
      <span className={cn("flex flex-wrap items-baseline gap-2", className)}>
        <span className="text-[20px] font-bold text-(--color-text-price-discount)">
          <span className="sr-only">Цена со скидкой: </span>
          {isFrom && "от "}
          {formatRub(amount)}
        </span>
        <del className="text-[15px] text-(--color-text-secondary)">
          <span className="sr-only">Без скидки: </span>
          {formatRub(oldAmount)}
        </del>
      </span>
    );
  }

  if (isFrom) {
    return (
      <span className={cn("flex items-baseline gap-1.5", className)}>
        <span className="text-[14px] text-(--color-text-secondary)">от</span>
        <span className="text-[20px] font-bold text-(--color-text-primary)">{formatRub(amount)}</span>
      </span>
    );
  }

  return (
    <span className={cn("text-[20px] font-bold text-(--color-text-primary)", className)}>
      {formatRub(amount)}
    </span>
  );
}
