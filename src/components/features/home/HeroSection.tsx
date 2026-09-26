import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { Search } from "@/components/ui/Search";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import type { BookingPreview } from "@/types/catalog";

interface HeroSectionProps {
  /** null — свободного времени нет, иллюстрация без превью записи. */
  preview: BookingPreview | null;
}

/**
 * Первый экран главной — рабочий инструмент, а не постер (PD-16):
 * два главных действия и поиск видны сразу.
 * «Записаться к врачу» — единственный розовый primary на экране.
 * Тексты desktop и mobile в Design v1 разные — выводятся по ширине.
 */
export function HeroSection({ preview }: HeroSectionProps) {
  return (
    <>
      <section aria-labelledby="hero-title">
        <Container className="pt-5 pb-7 md:pt-12 md:pb-12 xl:pt-16 xl:pb-24">
          <div className="xl:flex xl:items-start xl:justify-between xl:gap-16">
            <div className="flex flex-col gap-3.5 md:gap-6 xl:max-w-[560px]">
              <p className="hidden text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase md:block">
                Онлайн-запись
              </p>
              <h1
                id="hero-title"
                className="text-[30px] leading-[38px] font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]"
              >
                <span className="md:hidden">Запись к врачу и на анализы за минуту</span>
                <span className="hidden md:inline">Запишитесь к врачу или на анализы за минуту</span>
              </h1>
              <p className="text-[17px] leading-[26px] text-(--color-text-secondary) md:text-[18px] md:leading-7">
                <span className="md:hidden">Подтверждается сразу — без звонка в клинику.</span>
                <span className="hidden md:inline">
                  Выберите удобное время в расписании — запись подтверждается сразу, без звонка администратору.
                </span>
              </p>

              <div className="mt-1 flex flex-col gap-2.5 md:mt-0 md:flex-row md:flex-wrap md:gap-4">
                <Button
                  href={routes.booking}
                  variant="primary"
                  size="md"
                  className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]"
                >
                  Записаться к врачу
                </Button>
                <Button
                  href={routes.lab}
                  variant="secondary"
                  size="md"
                  className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]"
                >
                  Сдать анализы
                </Button>
              </div>

              <Search
                action={routes.services}
                label="Поиск врача, услуги или анализа"
                placeholder="Врач, услуга или анализ"
                size="responsive"
                className="md:max-w-[480px]"
              />
            </div>

            {/* Desktop: фото и превью записи, наложенное на угол */}
            <div aria-hidden="true" className="relative hidden shrink-0 pb-7 xl:block">
              <MediaPlaceholder
                label="Фото врача или клиники"
                icon="stethoscope"
                iconSize={88}
                className="h-[480px] w-[520px] rounded-[20px]"
              />
              {preview && (
                <BookingPreviewCard
                  preview={preview}
                  className="absolute bottom-0 -left-8 w-[400px] px-5 py-[18px] shadow-(--shadow-l)"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Mobile и промежуточные ширины: фото и превью друг под другом */}
      <div aria-hidden="true" className="xl:hidden">
        <Container className="flex flex-col gap-3.5 pb-7 md:pb-12">
          <MediaPlaceholder
            label="Фото врача или клиники"
            icon="stethoscope"
            iconSize={56}
            compactLabel
            className="h-[200px] w-full rounded-(--radius-l) md:h-[280px]"
          />
          {preview && <BookingPreviewCard preview={preview} compact className="p-[18px] shadow-(--shadow-s)" />}
        </Container>
      </div>
    </>
  );
}

interface BookingPreviewCardProps {
  preview: BookingPreview;
  compact?: boolean;
  className?: string;
}

/**
 * Декоративное превью записи: показывает, как выглядит выбор времени.
 * Не интерактивно и скрыто от скринридеров — действия дублируют кнопки героя.
 */
function BookingPreviewCard({ preview, compact, className }: BookingPreviewCardProps) {
  return (
    <div
      className={cn(
        "rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card)",
        className,
      )}
    >
      <div className={cn("flex items-center", compact ? "gap-3" : "gap-3.5")}>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)",
            compact ? "size-10" : "size-11",
          )}
        >
          <Icon name="user" size={compact ? 20 : 22} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-(--color-text-primary)">
            {preview.doctorName} · {preview.specialty}
          </p>
          <p className="mt-0.5 text-[12px] text-(--color-text-secondary)">{preview.dayLabel}</p>
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {preview.slots.map((slot) => {
          const selected = slot === preview.selectedSlot;
          return (
            <span
              key={slot}
              className={cn(
                "inline-flex h-11 min-w-[84px] items-center justify-center gap-1.5 rounded-(--radius-m) border-[1.5px] px-3.5 text-[15px] tabular-nums",
                selected
                  ? "border-(--color-cta-bg) bg-(--color-cta-bg) font-bold text-(--color-cta-text)"
                  : "border-(--color-border-decorative) bg-(--color-surface-card) font-semibold text-(--color-text-primary)",
              )}
            >
              {selected && <Icon name="check" size={15} />}
              {slot}
            </span>
          );
        })}
      </div>
    </div>
  );
}
