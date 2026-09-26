import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

interface BookingFrameProps {
  stepper: ReactNode;
  /** Карточка «Ваша запись» справа на desktop; на mobile — под шагом. */
  aside?: ReactNode;
  /** Закреплённая кнопка шага на mobile. */
  bottomBar?: ReactNode;
  /** Узкая колонка по центру: подтверждение и результат. */
  narrow?: boolean;
  children: ReactNode;
}

/** Каркас шага записи: степпер, содержимое шага и «Ваша запись». */
export function BookingFrame({ stepper, aside, bottomBar, narrow = false, children }: BookingFrameProps) {
  return (
    <div>
      {stepper}
      <Container className="pt-[18px] pb-8 md:pt-8 md:pb-12">
        <div className={cn(narrow ? "mx-auto max-w-[720px]" : "lg:flex lg:items-start lg:gap-10")}>
          <div className="min-w-0 flex-1">{children}</div>
          {aside && <div className="mt-6 lg:sticky lg:top-24 lg:mt-0 lg:w-[400px] lg:shrink-0">{aside}</div>}
        </div>
      </Container>
      {bottomBar}
    </div>
  );
}

interface BottomBarProps {
  /** Первая строка: «24 сентября, чт · 11:00». */
  caption: string;
  /** Вторая строка, крупно: цена. */
  value: string;
  action: ReactNode;
}

/**
 * Закреплённая кнопка шага на mobile (Booking-*-Mobile: «CTA закреплена внизу»).
 * Стоит последней в содержимом — прилипает к низу экрана и не перекрывает подвал.
 */
export function BookingBottomBar({ caption, value, action }: BottomBarProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-(--color-border-decorative) bg-(--color-surface-card) px-4 pt-3 pb-[max(14px,env(safe-area-inset-bottom))] shadow-(--shadow-l) lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] text-(--color-text-secondary)">{caption}</p>
          <p className="text-[17px] font-bold text-(--color-text-primary)">{value}</p>
        </div>
        <div className="shrink-0">{action}</div>
      </div>
    </div>
  );
}

/** Заголовок шага: 24px mobile / 36px desktop. */
export function StepTitle({ children, lead }: { children: ReactNode; lead?: ReactNode }) {
  return (
    <div>
      <h1 className="text-[24px] leading-[31px] font-bold text-(--color-text-primary) md:text-[36px] md:leading-[44px]">
        {children}
      </h1>
      {lead && (
        <p className="mt-2 max-w-[720px] text-[15px] leading-[22px] text-(--color-text-secondary) md:text-[17px] md:leading-[26px]">
          {lead}
        </p>
      )}
    </div>
  );
}
