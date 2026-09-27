import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

/**
 * Баннер «Комплексные программы (check-up)» (Homepage-*, раздел «Анализы»):
 * вход в /lab/packages. Стоит на главной и в каталоге анализов.
 * ink-600 на blue-50 — 6.70.
 */
export function PackagesBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[14px] border border-(--color-border-accent) bg-(--color-surface-accent) p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:px-7 md:py-6",
        className,
      )}
    >
      <div>
        <h3 className="text-[15px] font-bold text-(--color-text-primary) md:text-[16px]">
          Комплексные программы (check-up)
        </h3>
        <p className="mt-3 text-[13px] leading-[19px] text-(--color-text-secondary) md:mt-1 md:text-[14px] md:leading-5">
          Набор исследований на одну тему — за один визит.
        </p>
      </div>
      <Button href={routes.labPackages} variant="secondary" size="sm" className="w-full md:w-auto">
        Смотреть программы
      </Button>
    </div>
  );
}
