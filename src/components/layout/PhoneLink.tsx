import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { PLACEHOLDER, telHref } from "@/lib/placeholders";

interface PhoneLinkProps {
  phone: string | null;
  iconSize: number;
  className?: string;
}

/**
 * Телефон клиники. Пока номер UNKNOWN — показывается placeholder
 * обычным текстом, а не ссылкой: ссылка в никуда хуже её отсутствия.
 */
export function PhoneLink({ phone, iconSize, className }: PhoneLinkProps) {
  const classes = cn("inline-flex items-center gap-2 font-semibold text-(--color-text-link-strong)", className);

  if (!phone) {
    return (
      <span className={classes}>
        <Icon name="phone" size={iconSize} />
        {PLACEHOLDER.phone}
      </span>
    );
  }

  return (
    <a href={telHref(phone)} className={cn(classes, "rounded-(--radius-s) hover:underline")}>
      <Icon name="phone" size={iconSize} />
      {phone}
    </a>
  );
}
