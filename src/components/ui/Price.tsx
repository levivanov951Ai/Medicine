import { cn } from "@/lib/cn";
import { formatRub } from "@/lib/format";
import type { Price as PriceValue } from "@/types/catalog";

/**
 * Размеры из макетов (mobile → desktop):
 * xs 16→17 — связанные исследования;
 * row 16→19 — строки выбранных анализов;
 * sm 17→18 — услуги в профиле врача;
 * md 20    — карточки и строки каталогов (по умолчанию);
 * lg 22→24 — цена в профиле врача;
 * xl 24→28 — цена на странице анализа.
 */
export type PriceSize = "xs" | "row" | "sm" | "md" | "lg" | "xl";

const amountSizes: Record<PriceSize, string> = {
  xs: "text-[16px] md:text-[17px]",
  row: "text-[16px] md:text-[19px]",
  sm: "text-[17px] md:text-[18px]",
  md: "text-[20px]",
  lg: "text-[22px] md:text-[24px]",
  xl: "text-[24px] md:text-[28px]",
};

const oldSizes: Record<PriceSize, string> = {
  xs: "text-[12px] md:text-[14px]",
  row: "text-[12px] md:text-[14px]",
  sm: "text-[14px] md:text-[15px]",
  md: "text-[15px]",
  lg: "text-[15px] md:text-[18px]",
  xl: "text-[15px] md:text-[18px]",
};

interface PriceProps {
  price: PriceValue;
  size?: PriceSize;
  /**
   * Колонка «от» фиксированной ширины (26px) с 768px, как в строках каталогов:
   * суммы в списке выравниваются по левому краю независимо от префикса.
   */
  fromColumn?: boolean;
  className?: string;
}

/**
 * Цена Design v1: обычная, со скидкой (старая — зачёркнута), «от».
 * Скринридер получает словесную расшифровку, т. к. зачёркивание не озвучивается.
 */
export function Price({ price, size = "md", fromColumn = false, className }: PriceProps) {
  const { amount, oldAmount, isFrom } = price;
  const amountClass = cn("font-bold whitespace-nowrap", amountSizes[size]);

  // В колонке «от» с 768px занимает 26px всегда; на mobile — только если есть префикс.
  const from = fromColumn ? (
    <span
      className={cn(
        "text-[14px] text-(--color-text-secondary) md:w-[26px] md:shrink-0",
        isFrom ? "mr-1.5 md:mr-0" : "hidden md:block",
      )}
    >
      {isFrom && "от"}
    </span>
  ) : (
    isFrom && <span className="text-[14px] text-(--color-text-secondary)">от</span>
  );

  if (oldAmount !== undefined) {
    return (
      <span className={cn("flex items-baseline", !fromColumn && isFrom && "gap-1.5", className)}>
        {from}
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span className={cn(amountClass, "text-(--color-text-price-discount)")}>
            <span className="sr-only">Цена со скидкой: </span>
            {formatRub(amount)}
          </span>
          <del className={cn("whitespace-nowrap text-(--color-text-secondary)", oldSizes[size])}>
            <span className="sr-only">Без скидки: </span>
            {formatRub(oldAmount)}
          </del>
        </span>
      </span>
    );
  }

  if (isFrom || fromColumn) {
    return (
      <span className={cn("flex items-baseline", !fromColumn && "gap-1.5", className)}>
        {from}
        <span className={cn(amountClass, "text-(--color-text-primary)")}>{formatRub(amount)}</span>
      </span>
    );
  }

  return <span className={cn(amountClass, "text-(--color-text-primary)", className)}>{formatRub(amount)}</span>;
}
