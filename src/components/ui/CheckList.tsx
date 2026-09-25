import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface CheckListProps {
  items: string[];
  className?: string;
}

/** Список с галочками: «Когда может быть назначена», «Образование». */
export function CheckList({ items, className }: CheckListProps) {
  return (
    <ul className={cn("flex max-w-[640px] flex-col gap-2.5 md:gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-[3px] flex shrink-0 text-(--color-icon-strong)">
            <Icon name="check" size={16} className="size-[15px] md:size-4" />
          </span>
          <span className="text-[15px] leading-[22px] text-(--color-text-primary) md:text-[16px] md:leading-6">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Нумерованные шаги: «Как проходит приём». */
export function StepList({ items, className }: CheckListProps) {
  return (
    <ol className={cn("flex max-w-[640px] flex-col gap-3.5 md:gap-4", className)}>
      {items.map((item, index) => (
        <li key={item} className="flex items-start gap-3.5 md:gap-4">
          <span
            aria-hidden="true"
            className="flex size-[26px] shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-icon-plate-bg) text-[12px] font-bold text-(--color-icon-plate-fg) md:size-7 md:text-[13px]"
          >
            {index + 1}
          </span>
          <span className="mt-px text-[15px] leading-[22px] text-(--color-text-primary) md:mt-0.5 md:text-[16px] md:leading-6">
            {item}
          </span>
        </li>
      ))}
    </ol>
  );
}
