import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import type { Service } from "@/types/catalog";
import type { IconName } from "@/types/icon";

interface ServiceRowProps {
  service: Service;
  /** Мета-строка под названием, например длительность приёма. */
  meta?: string;
  icon?: IconName;
}

/**
 * Строка услуги для каталога «Услуги и цены» (следующий этап).
 * Паттерн из Design-System.dc.html, «Service Row / Analysis Row»:
 * иконка-плашка 40px, заголовок + мета, цена справа, «Акция» при скидке.
 * Радиус 14px — отличает строку от карточек (намеренно, по Design System).
 * На главной не используется.
 */
export function ServiceRow({ service, meta, icon = "stethoscope" }: ServiceRowProps) {
  const hasDiscount = service.price.oldAmount !== undefined;

  return (
    <article className="flex items-center gap-4 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) px-5 py-[18px]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold break-words text-(--color-text-primary)">{service.title}</h3>
        {meta && <p className="mt-0.5 text-[13px] text-(--color-text-secondary)">{meta}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Price price={service.price} />
        {hasDiscount && <Badge tone="promo">Акция</Badge>}
      </div>
    </article>
  );
}
