"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { LoadingState, Notice } from "@/components/ui/StateBlocks";
import {
  doctorDraftStore,
  newDraftId,
  syncDraftIdToUrl,
  type DoctorDraft,
  type DoctorStep,
} from "@/lib/booking-draft";
import { formatLongDate, formatShortDate, isIsoDate, isTime } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { maskPhone } from "@/lib/phone";
import { bookingService } from "@/services/booking";
import type { BookingTarget } from "@/services/booking/types";
import type { Category, Doctor } from "@/types/catalog";
import { BookingBottomBar, BookingFrame } from "./BookingFrame";
import { BookingStepper, type StepperStep } from "./BookingStepper";
import { BookingSuccess } from "./BookingSuccess";
import { BookingSummary } from "./BookingSummary";
import { ConfirmStep } from "./ConfirmStep";
import { DateTimeStep } from "./DateTimeStep";
import { DoctorPickStep } from "./DoctorPickStep";
import { PatientStep } from "./PatientStep";
import { ReservationTimer } from "./ReservationTimer";
import { ServicePickStep, type PickableService } from "./ServicePickStep";
import { useBookingMechanics } from "./use-booking-flow";

interface BookingDoctorFlowProps {
  services: PickableService[];
  categories: Category[];
  doctors: Doctor[];
  clinicAddress: string;
}

const STEPS: Array<{ step: DoctorStep; label: string }> = [
  { step: "service", label: "Услуга" },
  { step: "doctor", label: "Врач" },
  { step: "datetime", label: "Дата и время" },
  { step: "patient", label: "Данные" },
  { step: "confirm", label: "Подтверждение" },
];

const WITH_RESERVATION: DoctorStep[] = ["datetime", "patient", "confirm"];

/**
 * Запись к врачу (Booking-Doctor-*): Услуга → Врач → Дата и время → Данные →
 * Подтверждение → «Вы записаны». Известное до входа (услуга, врач, время
 * со страницы врача) берётся из адреса, проверяется по каталогу и повторно
 * не спрашивается (PD-03). Состояние — черновик в sessionStorage.
 */
export function BookingDoctorFlow({ services, categories, doctors, clinicAddress }: BookingDoctorFlowProps) {
  const [ready, setReady] = useState(false);
  const stored = doctorDraftStore.useValue();
  const draft = ready ? stored : null;

  // Вход в запись: адрес → новый черновик; обновление страницы → тот же черновик.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = doctorDraftStore.get();
    if (!current || params.get("draft") !== current.id) {
      const created = draftFromParams(params, services, doctors);
      doctorDraftStore.set(created);
      syncDraftIdToUrl(created.id);
    }
    // Черновик читается из sessionStorage — это возможно только в браузере, после гидратации.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, [services, doctors]);

  const service = services.find((item) => item.id === draft?.serviceId) ?? null;
  const doctor = doctors.find((item) => item.id === draft?.doctorId) ?? null;
  const offer = doctor && service ? doctor.services.find((item) => item.serviceId === service.id) : undefined;
  const price = offer?.price ?? service?.price ?? null;

  const target: BookingTarget | null = doctor
    ? { kind: "doctor", doctorId: doctor.id, serviceId: service?.id ?? null }
    : null;
  const { patch, reserve, dropReservation, exit } = useBookingMechanics(
    doctorDraftStore,
    draft,
    target,
    WITH_RESERVATION,
  );

  const handleRequested = useCallback(
    (result: "reserved" | "unavailable") =>
      patch({ requestedSlot: undefined, notice: result === "unavailable" ? "requested-slot-unavailable" : undefined }),
    [patch],
  );

  if (!draft) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-6 xl:px-0">
        <LoadingState label="Загружаем запись" />
      </div>
    );
  }

  const releaseAndPatch = (changes: Partial<DoctorDraft>) => {
    if (draft.reservation) bookingService.releaseReservation(draft.reservation.id);
    patch({ reservation: undefined, date: undefined, time: undefined, notice: undefined, ...changes });
  };

  const goBack = () => {
    const order: DoctorStep[] = ["service", "doctor", "datetime", "patient", "confirm"];
    const index = order.indexOf(draft.step);
    // Назад — к предыдущему шагу, который пациент проходил сам.
    for (let previous = index - 1; previous >= 0; previous -= 1) {
      const step = order[previous];
      if (step === "service" && draft.preset.service) continue;
      if (step === "doctor" && draft.preset.doctor) continue;
      patch({ step, notice: undefined });
      return;
    }
    exit();
  };

  const stepper = (
    <BookingStepper onBack={goBack} steps={stepperSteps(draft)} />
  );

  const slotLabel = draft.date && draft.time ? `${formatLongDate(draft.date)} · ${draft.time}` : null;
  const doctorLabel = doctor ? `${doctor.name} · ${doctor.specialty.toLocaleLowerCase("ru-RU")}` : null;

  const summary = (withTimer: boolean) =>
    price && (
      <BookingSummary
        fields={[
          { label: "Услуга", value: service?.title ?? null },
          { label: "Врач", value: doctorLabel },
          { label: "Дата и время", value: slotLabel },
        ]}
        total={{ label: "Стоимость", amount: price.amount }}
        footer={withTimer && draft.reservation && <ReservationTimer expiresAt={draft.reservation.expiresAt} />}
      />
    );

  const contextNotice = draft.notice && ["unknown-service", "unknown-doctor", "service-not-offered"].includes(draft.notice) && (
    <Notice
      tone="info"
      icon="alert"
      role="status"
      className="mb-5"
      title={
        draft.notice === "unknown-doctor"
          ? "Не нашли врача по ссылке"
          : draft.notice === "service-not-offered"
            ? "Этот врач не проводит выбранную услугу"
            : "Не нашли услугу по ссылке"
      }
      description="Выберите из списка — остальное, что вы уже выбрали, сохранено."
    />
  );

  // — Шаги —

  if (draft.step === "service") {
    const list = doctor
      ? doctor.services.flatMap((item) => {
          const found = services.find((candidate) => candidate.id === item.serviceId);
          return found ? [{ ...found, price: item.price }] : [];
        })
      : services;
    return (
      <BookingFrame stepper={stepper}>
        {contextNotice}
        <ServicePickStep
          services={list}
          categories={categories}
          doctorName={doctor?.name}
          onSelect={(serviceId) =>
            releaseAndPatch({ serviceId, step: doctor ? "datetime" : "doctor" })
          }
        />
      </BookingFrame>
    );
  }

  if (draft.step === "doctor" && service) {
    const offering = doctors.flatMap((item) => {
      const found = item.services.find((candidate) => candidate.serviceId === service.id);
      return found ? [{ doctor: item, price: found.price }] : [];
    });
    return (
      <BookingFrame stepper={stepper}>
        {contextNotice}
        <DoctorPickStep
          serviceId={service.id}
          serviceTitle={service.title}
          doctors={offering}
          onSelect={(doctorId) => releaseAndPatch({ doctorId, step: "datetime" })}
          onChangeService={() => releaseAndPatch({ step: "service", preset: { ...draft.preset, service: false } })}
        />
      </BookingFrame>
    );
  }

  if (draft.step === "datetime" && service && doctor && target && price) {
    return (
      <BookingFrame
        stepper={stepper}
        aside={<div className="hidden lg:block">{summary(false)}</div>}
        bottomBar={
          draft.reservation &&
          slotLabel && (
            <BookingBottomBar
              caption={`${formatShortDate(draft.date!)} · ${draft.time}`}
              value={formatRub(price.amount)}
              action={<Button onClick={() => patch({ step: "patient" })}>Продолжить</Button>}
            />
          )
        }
      >
        <DateTimeStep
          target={target}
          intro={
            <ContextCard
              title={doctor.name}
              subtitle={`${service.title} · ${formatRub(price.amount)}`}
              onChange={() => releaseAndPatch({ step: "doctor", preset: { ...draft.preset, doctor: false } })}
            />
          }
          reservation={draft.reservation ?? null}
          requestedSlot={draft.requestedSlot}
          onRequestedSlotHandled={handleRequested}
          notice={draft.notice}
          onDismissNotice={() => draft.notice && patch({ notice: undefined })}
          onReserve={reserve}
          onContinue={() => patch({ step: "patient" })}
        />
      </BookingFrame>
    );
  }

  if (draft.step === "patient" && draft.reservation && service && doctor) {
    return (
      <BookingFrame stepper={stepper} aside={<div className="hidden lg:block">{summary(true)}</div>}>
        <div className="mb-5 lg:hidden">
          <ReservationTimer expiresAt={draft.reservation.expiresAt} />
        </div>
        <PatientStep
          initial={draft.patient}
          initiallyVerified={draft.phoneVerified}
          onComplete={(patient) => patch({ patient, phoneVerified: true, step: "confirm" })}
        />
      </BookingFrame>
    );
  }

  if (draft.step === "confirm" && draft.reservation && draft.patient && service && doctor && price && target) {
    const reservation = draft.reservation;
    const patient = draft.patient;
    return (
      <BookingFrame stepper={stepper} narrow>
        <ConfirmStep
          reservation={reservation}
          total={{ label: "Стоимость", amount: price.amount }}
          sections={[
            {
              title: "Приём",
              onEdit: () => patch({ step: "datetime" }),
              rows: [
                { label: "Услуга", value: service.title },
                { label: "Врач", value: doctorLabel ?? "" },
                { label: "Дата", value: formatLongDate(reservation.slot.date) },
                { label: "Время", value: reservation.slot.time },
              ],
            },
            {
              title: "Пациент",
              onEdit: () => patch({ step: "patient" }),
              rows: [
                { label: "Имя", value: patient.name },
                { label: "Телефон", value: maskPhone(patient.phoneDigits) },
              ],
            },
            { title: "Где", rows: [{ label: "Адрес", value: clinicAddress }] },
          ]}
          onConfirm={async () => {
            const result = await bookingService.createAppointment({ target, reservation, patient });
            if (result.ok) patch({ step: "done", appointmentId: result.appointmentId, reservation: undefined });
            else dropReservation(result.reason === "expired" ? "expired" : "slot-unavailable");
          }}
        />
      </BookingFrame>
    );
  }

  if (draft.step === "done" && service && doctor && price && draft.date && draft.time) {
    return (
      <BookingFrame stepper={null} narrow>
        <BookingSuccess
          message={`Запись подтверждена. Ждём вас ${formatLongDate(draft.date).split(",")[0]} в ${draft.time}.`}
          rows={[
            { label: "Услуга", value: service.title },
            { label: "Врач", value: doctorLabel ?? "" },
            { label: "Дата и время", value: `${formatLongDate(draft.date)} · ${draft.time}` },
            { label: "Адрес", value: clinicAddress },
            { label: "Стоимость", value: `${formatRub(price.amount)} · оплата в клинике` },
          ]}
        />
      </BookingFrame>
    );
  }

  // Черновик не согласуется с каталогом (например, услугу убрали) — начинаем с выбора услуги.
  return (
    <BookingFrame stepper={stepper}>
      <Notice
        tone="info"
        icon="alert"
        role="status"
        title="Не удалось продолжить запись"
        description="Часть выбранного больше недоступна. Выберите услугу заново — это займёт минуту."
        action={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => releaseAndPatch({ step: "service", serviceId: null, doctorId: null, preset: { service: false, doctor: false } })}
          >
            Выбрать услугу
          </Button>
        }
      />
    </BookingFrame>
  );
}

/** Стартовое состояние по параметрам адреса. Параметрам не доверяем — всё сверяется с каталогом. */
function draftFromParams(params: URLSearchParams, services: PickableService[], doctors: Doctor[]): DoctorDraft {
  const serviceParam = params.get("service");
  const doctorParam = params.get("doctor");
  const date = params.get("date");
  const time = params.get("time");

  let serviceId = services.some((item) => item.id === serviceParam) ? serviceParam : null;
  const doctor = doctors.find((item) => item.id === doctorParam) ?? null;
  let notice: DoctorDraft["notice"];

  if (serviceParam && !serviceId) notice = "unknown-service";
  if (doctorParam && !doctor) notice = "unknown-doctor";
  if (doctor && serviceId && !doctor.services.some((item) => item.serviceId === serviceId)) {
    notice = "service-not-offered";
    serviceId = null;
  }

  const step: DoctorStep = !serviceId ? "service" : !doctor ? "doctor" : "datetime";
  return {
    id: newDraftId(),
    flow: "doctor",
    step,
    serviceId,
    doctorId: doctor?.id ?? null,
    preset: { service: Boolean(serviceId), doctor: Boolean(doctor) },
    requestedSlot: doctor && date && time && isIsoDate(date) && isTime(time) ? { date, time } : undefined,
    notice,
  };
}

function stepperSteps(draft: DoctorDraft): StepperStep[] {
  const order = STEPS.map((item) => item.step);
  const currentIndex = draft.step === "done" ? order.length : order.indexOf(draft.step);
  return STEPS.map(({ step, label }, index) => {
    const presetDone = (step === "service" && draft.preset.service) || (step === "doctor" && draft.preset.doctor);
    const state = index === currentIndex ? "current" : index < currentIndex || presetDone ? "done" : "upcoming";
    return { label, state };
  });
}

/** Выбранный врач и услуга над календарём на mobile (Booking-Doctor-Mobile, шаг 3). */
function ContextCard({ title, subtitle, onChange }: { title: string; subtitle: string; onChange: () => void }) {
  return (
    <div className="flex items-center gap-2.5 rounded-(--radius-m) border border-(--color-border-decorative) bg-(--color-surface-page) px-3 py-2.5 lg:hidden">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-(--radius-pill) border border-(--color-border-decorative) bg-(--color-icon-plate-bg) text-(--color-icon-accent)">
        <Icon name="user" size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold text-(--color-text-primary)">{title}</p>
        <p className="text-[12px] text-(--color-text-secondary)">{subtitle}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="touch-target inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold text-(--color-text-link-strong) hover:underline"
      >
        Изменить
        <span className="sr-only"> врача</span>
        <Icon name="arrow-right" size={16} />
      </button>
    </div>
  );
}
