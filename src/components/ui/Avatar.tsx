import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface AvatarProps {
  /** Имя пациента; без имени — иконка пользователя. */
  name: string | null;
  size?: "sm" | "md";
  className?: string;
}

const sizes = {
  sm: "size-8 text-[14px]",
  md: "size-10 text-[16px]",
};

/**
 * Кружок с первой буквой имени (Header-Desktop, «Авторизован»).
 * Декоративный: имя рядом всегда написано текстом, поэтому скрыт от скринридеров.
 * blue-700 на blue-100 — 6.09.
 */
export function Avatar({ name, size = "sm", className }: AvatarProps) {
  const initial = name?.trim().charAt(0).toLocaleUpperCase("ru-RU");
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-surface-info) font-bold text-(--color-badge-info-fg)",
        sizes[size],
        className,
      )}
    >
      {initial || <Icon name="user" size={size === "sm" ? 16 : 20} />}
    </span>
  );
}
