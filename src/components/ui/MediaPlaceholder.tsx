import { cn } from "@/lib/cn";
import type { IconName } from "@/types/icon";
import { Icon } from "./Icon";

interface MediaPlaceholderProps {
  /** Подпись-метка в углу: «Фото врача», «Фото клиники». */
  label: string;
  icon: IconName;
  iconSize: number;
  /** Мелкая метка — для mobile-карточек (11px вместо 12px). */
  compactLabel?: boolean;
  className?: string;
}

/**
 * Заглушка фото из Design v1: мягкий голубой градиент, крупная декоративная
 * иконка и метка в углу. Реальных фото пока нет (UNKNOWN) — выдумывать
 * изображения врачей нельзя (PROJECT_CONTEXT.md).
 * Декоративна: скрыта от скринридеров.
 */
export function MediaPlaceholder({ label, icon, iconSize, compactLabel, className }: MediaPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-(--color-border-decorative)",
        "bg-[linear-gradient(160deg,var(--color-placeholder-media-from)_0%,var(--color-bg-page)_65%)]",
        className,
      )}
    >
      <span className="flex text-(--color-placeholder-media-icon)">
        <Icon name={icon} size={iconSize} strokeWidth={1.3} />
      </span>
      <span
        className={cn(
          "absolute inline-flex items-center rounded-(--radius-pill) border border-(--color-border-decorative)",
          "bg-(--color-placeholder-media-badge-bg) font-semibold text-(--color-text-secondary)",
          compactLabel
            ? "top-3 left-3 gap-[5px] px-[9px] py-1 text-[11px]"
            : "top-4 left-4 gap-1.5 px-2.5 py-[5px] text-[12px]",
        )}
      >
        <Icon name="file-text" size={compactLabel ? 12 : 13} />
        {label}
      </span>
    </div>
  );
}
