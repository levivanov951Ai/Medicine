"use client";

import { useEffect, useState } from "react";
import { DoctorCard } from "@/components/features/doctors/DoctorCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/StateBlocks";
import { getNextSlotLabel } from "@/services/availability";
import type { Doctor, Price } from "@/types/catalog";
import { StepTitle } from "./BookingFrame";

interface DoctorPickStepProps {
  serviceId: string;
  serviceTitle: string;
  doctors: Array<{ doctor: Doctor; price: Price }>;
  onSelect: (doctorId: string) => void;
  onChangeService: () => void;
}

/**
 * Шаг «Врач» (Booking-Doctor-*, шаг 2): только врачи, которые проводят
 * выбранную услугу; цена — за эту услугу у врача, ближайшее время —
 * из того же расписания, что и календарь.
 */
export function DoctorPickStep({ serviceId, serviceTitle, doctors, onSelect, onChangeService }: DoctorPickStepProps) {
  const labels = useNextSlotLabels(doctors.map(({ doctor }) => doctor.id));

  return (
    <div className="flex flex-col">
      <StepTitle>Выберите врача</StepTitle>
      <div className="mt-3.5 flex items-center gap-2 self-start rounded-(--radius-m) border border-(--color-border-decorative) bg-(--color-surface-page) px-3 py-2.5 md:mt-5 md:gap-3 md:px-4">
        <span className="flex shrink-0 text-(--color-icon-strong)">
          <Icon name="check" size={16} />
        </span>
        <span className="hidden text-[14px] text-(--color-text-secondary) md:inline">Услуга:</span>
        <span className="min-w-0 text-[14px] font-semibold text-(--color-text-primary) md:text-[15px]">{serviceTitle}</span>
        <button
          type="button"
          onClick={onChangeService}
          className="touch-target inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold text-(--color-text-link-strong) hover:underline md:text-[14px]"
        >
          Изменить
          <span className="sr-only"> услугу</span>
          <Icon name="arrow-right" size={16} />
        </button>
      </div>

      {doctors.length === 0 ? (
        <div className="mt-6 rounded-[14px] border border-(--color-border-decorative) px-4 py-8">
          <EmptyState
            icon="user"
            titleAs="h2"
            title="Сейчас нет врачей со свободным расписанием на эту услугу"
            description="Выберите другую услугу — запись на неё откроется, как только появится расписание."
            action={
              <Button variant="secondary" size="sm" onClick={onChangeService}>
                Выбрать другую услугу
              </Button>
            }
          />
        </div>
      ) : (
        <ul className="mt-3.5 grid grid-cols-1 gap-3 md:mt-7 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {doctors.map(({ doctor, price }) => (
            <li key={doctor.id}>
              <DoctorCard
                variant="select"
                doctor={{ ...doctor, nextSlotLabel: labels[doctor.id] ?? null }}
                serviceContext={{ serviceId, price }}
                onSelect={() => onSelect(doctor.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** «Сегодня, 14:20» для каждого врача — то же правило, что на карточках каталога. */
function useNextSlotLabels(doctorIds: string[]): Record<string, string | null> {
  const [labels, setLabels] = useState<Record<string, string | null>>({});
  const key = doctorIds.join(",");

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      key
        .split(",")
        .filter(Boolean)
        .map(async (doctorId) => [doctorId, await getNextSlotLabel(doctorId)] as const),
    ).then((entries) => !cancelled && setLabels(Object.fromEntries(entries)));
    return () => {
      cancelled = true;
    };
  }, [key]);

  return labels;
}
