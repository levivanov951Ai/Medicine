import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  /** Пояснение под заголовком — в Design v1 только на desktop. */
  description?: string;
  /** Ссылка «Все …» справа — в Design v1 только на desktop. */
  link?: { href: string; label: string };
  /** Секция на подкрашенном фоне: eyebrow темнее (правило A). */
  onTinted?: boolean;
  className?: string;
}

/** Заголовок секции главной: eyebrow «01 · Каталог», H2, ссылка «Все …». */
export function SectionHeading({ id, eyebrow, title, description, link, onTinted, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-5 flex items-end gap-6 md:mb-8", className)}>
      <div>
        <p
          className={cn(
            "text-[13px] font-bold tracking-[.06em] uppercase",
            onTinted ? "text-(--color-text-accent-on-tinted)" : "text-(--color-text-accent)",
          )}
        >
          {eyebrow}
        </p>
        <h2
          id={id}
          className="mt-1.5 text-[24px] leading-8 font-bold text-(--color-text-primary) md:text-[32px] md:leading-10"
        >
          {title}
        </h2>
        {description && (
          <p className="mt-2 hidden max-w-[640px] text-[16px] leading-6 text-(--color-text-secondary) md:block">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="ml-auto hidden items-center gap-1.5 rounded-(--radius-s) text-[15px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline md:inline-flex"
        >
          {link.label}
          <Icon name="arrow-right" size={16} />
        </Link>
      )}
    </div>
  );
}
