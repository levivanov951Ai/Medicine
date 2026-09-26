import { TimeSlot } from "@/components/ui/TimeSlot";
import { formatDayMonthFromIso, formatLongDate, formatRelativeDay, toIsoDate } from "@/lib/dates";
import { routes } from "@/lib/routes";
import type { DayAvailability } from "@/services/booking/types";

interface DoctorQuickSlotsProps {
  doctorId: string;
  days: DayAvailability[];
}

const SLOTS_PER_DAY = 8;

/** «Завтра, 26 сентября» / «29 сентября, вторник». */
function dayTitle(date: string, today: string) {
  const relative = formatRelativeDay(date, today);
  return relative === "Сегодня" || relative === "Завтра"
    ? `${relative}, ${formatDayMonthFromIso(date)}`
    : formatLongDate(date);
}

/**
 * «Ближайшие свободные даты и время» на странице врача (DoctorProfile-*).
 * Слоты — из того же расписания, что календарь записи. Нажатие на время
 * открывает запись с врачом и этим временем: мастер проверит, что время
 * ещё свободно, попросит выбрать услугу и сразу зарезервирует слот.
 * Полный календарь — внутри записи.
 */
export function DoctorQuickSlots({ doctorId, days }: DoctorQuickSlotsProps) {
  if (days.length === 0) return null;
  const today = toIsoDate(new Date());

  return (
    <section aria-labelledby="quick-slots-title" className="pb-8 md:pb-14">
      <h2
        id="quick-slots-title"
        className="mb-3 text-[24px] leading-8 font-bold text-(--color-text-primary) md:mb-4 md:text-[32px] md:leading-10"
      >
        Ближайшие свободные даты и время
      </h2>
      <div className="max-w-[820px] rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-5 shadow-(--shadow-s) md:p-7">
        <div className="flex flex-col gap-4 md:gap-5">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2.5 md:gap-3">
              <h3 className="text-[13px] font-bold text-(--color-text-primary) md:text-[14px]">
                {dayTitle(day.date, today)}
              </h3>
              <ul className="flex flex-wrap gap-2 md:gap-2.5">
                {day.slots.slice(0, SLOTS_PER_DAY).map((slot) => (
                  <li key={slot.time}>
                    {slot.available ? (
                      <TimeSlot
                        state="link"
                        time={slot.time}
                        dateLabel={formatDayMonthFromIso(day.date)}
                        href={routes.bookingWithSlot(doctorId, day.date, slot.time)}
                      />
                    ) : (
                      <TimeSlot state="busy" time={slot.time} dateLabel={formatDayMonthFromIso(day.date)} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2.5 max-w-[820px] text-[12px] text-(--color-text-secondary) md:mt-3 md:text-[13px]">
        Нажмите на время — откроется запись с этим временем. Весь календарь — внутри записи.
      </p>
    </section>
  );
}
