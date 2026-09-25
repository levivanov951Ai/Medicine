import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  /** Родительские разделы — ссылки. */
  items: BreadcrumbItem[];
  /** Текущая страница — последний уровень. */
  current: string;
  /** Короткая подпись текущей страницы для mobile. Без неё на mobile уровень скрыт. */
  mobileCurrent?: string;
  className?: string;
}

/**
 * Хлебные крошки Design v1.
 * Desktop — все уровни; mobile — без текущей страницы (намеренное
 * упрощение макета: заголовок страницы и так виден сразу под крошками)
 * или с её короткой подписью.
 */
export function Breadcrumbs({ items, current, mobileCurrent, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-(--color-text-secondary) md:gap-x-2 md:text-[14px]">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-1.5 md:gap-2">
            {index > 0 && <Separator />}
            <Link
              href={item.href}
              className="touch-target rounded-(--radius-s) py-1 font-semibold text-(--color-text-link-strong) hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className={cn("items-center gap-1.5 md:flex md:gap-2", mobileCurrent ? "flex" : "hidden")}>
          <Separator />
          <span aria-current="page">
            {mobileCurrent ? (
              <>
                <span className="md:hidden">{mobileCurrent}</span>
                <span className="hidden md:inline">{current}</span>
              </>
            ) : (
              current
            )}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function Separator() {
  return (
    <span className="flex text-(--color-icon-muted)">
      <Icon name="chevron-right" size={14} className="size-3 md:size-3.5" />
    </span>
  );
}
