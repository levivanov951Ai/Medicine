"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BookingBottomBar, BookingFrame } from "@/components/features/booking/BookingFrame";
import { BookingStepper, type StepperStep } from "@/components/features/booking/BookingStepper";
import { BookingSummary } from "@/components/features/booking/BookingSummary";
import { ConfirmStep } from "@/components/features/booking/ConfirmStep";
import { DateTimeStep } from "@/components/features/booking/DateTimeStep";
import { ReservationTimer } from "@/components/features/booking/ReservationTimer";
import { useBookingMechanics } from "@/components/features/booking/use-booking-flow";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState, Notice } from "@/components/ui/StateBlocks";
import { authSession, useAuth } from "@/lib/auth-session";
import { rescheduleDraftStore, type RescheduleDraft, type RescheduleStep } from "@/lib/booking-draft";
import { formatLongDate, formatShortDate } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { AppointmentReferences } from "@/services/account";
import { appointmentService } from "@/services/appointments";
import { bookingService } from "@/services/booking";
import type { BookingTarget } from "@/services/booking/types";
import type { Appointment } from "@/types/appointment";
import { describeAppointment } from "./appointment-view";

type Load =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "not-allowed"; appointment: Appointment; reason: string | null }
  | { kind: "ready"; appointment: Appointment };

const WITH_RESERVATION: RescheduleStep[] = ["datetime", "confirm"];

/**
 * Перенос записи (PD-06: текущая запись → новые дата и время → подтверждение).
 * Отдельного экрана в Design v1 нет — собран из шагов записи: тот же календарь,
 * слоты, резерв на 5 минут, «Ваша запись» и подтверждение.
 *
 * Меняются только дата и время: услуга, врач, анализы и стоимость остаются.
 * Пока перенос не подтверждён, запись остаётся на прежнем времени —
 * при истёкшем резерве или занятом слоте пациент просто выбирает время заново.
 */
export function RescheduleFlow({ id, references }: { id: string; references: AppointmentReferences }) {
  const router = useRouter();
  const auth = useAuth();
  const patientId = auth.status === "authenticated" ? auth.patient.id : null;
  const [load, setLoad] = useState<Load>({ kind: "loading" });
  const [failure, setFailure] = useState(false);
  const stored = rescheduleDraftStore.useValue();
  const draft = stored?.appointmentId === id ? stored : null;

  useEffect(() => {
    if (!patientId) return;
    appointmentService.getForPatient(patientId, id).then(async (appointment) => {
      if (!appointment) return setLoad({ kind: "missing" });
      const actions = await appointmentService.getActions(appointment);
      if (!actions.canReschedule) return setLoad({ kind: "not-allowed", appointment, reason: actions.restrictionReason });
      // Новый перенос или продолжение после обновления страницы.
      if (rescheduleDraftStore.get()?.appointmentId !== id) {
        rescheduleDraftStore.set({ appointmentId: id, step: "datetime" });
      }
      setLoad({ kind: "ready", appointment });
    });
  }, [patientId, id]);

  const appointment = load.kind === "ready" ? load.appointment : null;
  const target: BookingTarget | null = appointment
    ? appointment.type === "lab"
      ? { kind: "lab" }
      : { kind: "doctor", doctorId: appointment.doctorId, serviceId: appointment.serviceId }
    : null;
  const { patch, reserve, dropReservation } = useBookingMechanics(rescheduleDraftStore, draft, target, WITH_RESERVATION);

  const backToDetails = () => {
    if (draft?.reservation) bookingService.releaseReservation(draft.reservation.id);
    rescheduleDraftStore.set(null);
    router.push(routes.appointment(id));
  };

  if (load.kind === "missing" || load.kind === "not-allowed") {
    return (
      <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
        <div className="mx-auto max-w-[560px] rounded-(--radius-l) bg-(--color-surface-page) px-4 py-10">
          <EmptyState
            icon="calendar"
            titleAs="h1"
            title={load.kind === "missing" ? "Запись не найдена" : "Эту запись нельзя перенести"}
            description={
              load.kind === "missing"
                ? "Возможно, ссылка устарела или запись оформлена с другого номера."
                : (load.reason ?? "Переносить можно только предстоящую запись.")
            }
            action={
              <Button href={load.kind === "missing" ? routes.account : routes.appointment(id)} variant="secondary" size="sm">
                {load.kind === "missing" ? "Все записи" : "К записи"}
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  if (!appointment || !target || !draft) {
    return (
      <Container className="py-10 md:py-16">
        <LoadingState label="Загружаем запись" />
      </Container>
    );
  }

  const view = describeAppointment(appointment, references);
  const currentLabel = `${formatLongDate(appointment.date)} · ${appointment.time}`;
  const newLabel = draft.date && draft.time && draft.reservation ? `${formatLongDate(draft.date)} · ${draft.time}` : null;
  const doctorLabel = view.doctor ? `${view.doctor.name} · ${view.doctor.specialty.toLocaleLowerCase("ru-RU")}` : null;
  const whatFields =
    appointment.type === "doctor"
      ? [
          { label: "Услуга", value: view.title },
          { label: "Врач", value: doctorLabel },
        ]
      : [{ label: "Анализы", value: view.analyses.join(", ") }];

  const stepper = (
    <BookingStepper
      onBack={draft.step === "confirm" ? () => patch({ step: "datetime" }) : backToDetails}
      steps={stepperSteps(draft)}
    />
  );

  if (draft.step === "confirm" && draft.reservation) {
    const reservation = draft.reservation;
    return (
      <BookingFrame stepper={stepper} narrow>
        {failure && (
          <Notice
            tone="warning"
            icon="alert"
            role="alert"
            className="mb-5"
            title="Не удалось перенести запись"
            description="Запись осталась на прежнем времени. Обновите страницу записи и попробуйте ещё раз."
          />
        )}
        <ConfirmStep
          reservation={reservation}
          title="Проверьте перенос"
          confirmLabel="Подтвердить перенос"
          total={{ label: "Стоимость", amount: appointment.price }}
          sections={[
            {
              title: appointment.type === "lab" ? "Анализы" : "Приём",
              rows: whatFields.map((field) => ({ label: field.label, value: field.value ?? "" })),
            },
            {
              title: "Время",
              onEdit: () => patch({ step: "datetime" }),
              rows: [
                { label: "Было", value: currentLabel },
                { label: "Станет", value: `${formatLongDate(reservation.slot.date)} · ${reservation.slot.time}` },
              ],
            },
            { title: "Где", rows: [{ label: "Адрес", value: appointment.clinicAddress }] },
          ]}
          onConfirm={async () => {
            const current = await authSession.currentPatient();
            if (!current) return;
            const result = await bookingService.rescheduleAppointment({
              patientId: current.id,
              appointmentId: appointment.id,
              target,
              reservation,
            });
            if (result.ok) {
              rescheduleDraftStore.set(null);
              router.replace(`${routes.appointment(appointment.id)}?updated=rescheduled`);
            } else if (result.reason === "not-allowed") {
              setFailure(true);
            } else {
              dropReservation(result.reason === "expired" ? "expired" : "slot-unavailable");
            }
          }}
        />
      </BookingFrame>
    );
  }

  const summary = (
    <BookingSummary
      fields={[...whatFields, { label: "Сейчас", value: currentLabel }, { label: "Новое время", value: newLabel }]}
      total={{ label: "Стоимость", amount: appointment.price }}
      footer={draft.reservation && <ReservationTimer expiresAt={draft.reservation.expiresAt} />}
    />
  );

  return (
    <BookingFrame
      stepper={stepper}
      aside={<div className="hidden lg:block">{summary}</div>}
      bottomBar={
        draft.reservation &&
        draft.date && (
          <BookingBottomBar
            caption={`${formatShortDate(draft.date)} · ${draft.time}`}
            value={formatRub(appointment.price)}
            action={<Button onClick={() => patch({ step: "confirm" })}>Продолжить</Button>}
          />
        )
      }
    >
      <DateTimeStep
        target={target}
        intro={
          <Notice
            tone="info"
            icon="calendar"
            title={`Сейчас: ${currentLabel}`}
            description={`${view.title}${doctorLabel && appointment.type === "doctor" ? ` · ${doctorLabel}` : ""}. Выберите новое время — до подтверждения переноса запись остаётся на прежнем.`}
          />
        }
        reservation={draft.reservation ?? null}
        onRequestedSlotHandled={() => undefined}
        notice={draft.notice}
        onDismissNotice={() => draft.notice && patch({ notice: undefined })}
        onReserve={reserve}
        onContinue={() => patch({ step: "confirm" })}
      />
    </BookingFrame>
  );
}

function stepperSteps(draft: RescheduleDraft): StepperStep[] {
  return [
    { label: "Новое время", state: draft.step === "datetime" ? "current" : "done" },
    { label: "Подтверждение", state: draft.step === "confirm" ? "current" : "upcoming" },
  ];
}
