import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface MapPlaceholderProps {
  /** Подпись заглушки: «Карта (заглушка)» на «Контактах», «Карта проезда» на главной. */
  label: string;
  /**
   * page — «Контакты» (Cabinet-Contacts-*): пунктирная рамка, голубой градиент, крупная иконка;
   * section — секция «Контакты» на главной (Homepage-*): серый блок, иконка в строку с подписью.
   */
  variant?: "page" | "section";
  /** Высота и отступы задаются снаружи — у страниц они разные. */
  className?: string;
}

/**
 * Map Placeholder (Design System) — место под карту проезда.
 *
 * Настоящая карта (Яндекс / 2ГИС) не подключена: нужны ключ API и координаты
 * филиала — они UNKNOWN (DEVELOPER_HANDOFF.md, раздел 7). Чтобы подключить карту,
 * достаточно заменить содержимое этого компонента — страницы менять не придётся.
 * Декоративная: адрес всегда написан рядом текстом, поэтому скрыта от скринридеров.
 * Подпись — --color-text-secondary (решение G, CONTRAST_AUDIT.md).
 */
export function MapPlaceholder({ label, variant = "page", className }: MapPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center gap-2 rounded-(--radius-l) text-(--color-text-secondary)",
        variant === "page"
          ? "flex-col border border-dashed border-(--color-border-decorative) bg-linear-160 from-(--color-placeholder-media-from) to-(--color-surface-card) to-70% text-[13px]"
          : "border border-(--color-border-decorative) bg-(--color-surface-page) text-[14px]",
        className,
      )}
    >
      <span className={cn("flex", variant === "page" && "text-(--color-icon-accent)")}>
        <Icon name="pin" size={variant === "page" ? 32 : 20} />
      </span>
      <span>{label}</span>
    </div>
  );
}
