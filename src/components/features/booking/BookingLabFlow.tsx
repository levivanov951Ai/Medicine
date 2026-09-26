"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelection } from "@/components/features/analyses/use-selection";
import { Button } from "@/components/ui/Button";
import { EmptyState, LoadingState, Notice } from "@/components/ui/StateBlocks";
import { labDraftStore, newDraftId, syncDraftIdToUrl, type LabStep } from "@/lib/booking-draft";
import { formatLongDate, formatShortDate } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { maskPhone } from "@/lib/phone";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import { selectedAnalyses } from "@/lib/selected-analyses";
import type { AnalysisListItem } from "@/services/analyses";
import { bookingService } from "@/services/booking";
import type { BookingTarget } from "@/services/booking/types";
import { BookingBottomBar, BookingFrame } from "./BookingFrame";
import { BookingStepper, type StepperStep } from "./BookingStepper";
import { BookingSuccess } from "./BookingSuccess";
import { BookingSummary, type SummaryItem } from "./BookingSummary";
import { ConfirmStep } from "./ConfirmStep";
import { DateTimeStep } from "./DateTimeStep";
import { PatientStep } from "./PatientStep";
import { ReservationTimer } from "./ReservationTimer";
import { useBookingMechanics } from "./use-booking-flow";

interface BookingLabFlowProps {
  catalog: AnalysisListItem[];
  clinicAddress: string;
}

const LAB_TARGET: BookingTarget = { kind: "lab" };
const WITH_RESERVATION: LabStep[] = ["datetime", "patient", "confirm"];
const STEPS: Array<{ step: LabStep | "analyses"; label: string }> = [
  { step: "analyses", label: "Анализы" },
  { step: "datetime", label: "Дата и время" },
  { step: "patient", label: "Данные" },
  { step: "confirm", label: "Подтверждение" },
];

const needsFasting = (preparation: string) => /натощак/i.test(preparation);

/**
 * Запись на анализы (Booking-Labs-*): Выбранные анализы → Дата и время →
 * Данные → Подтверждение → «Вы записаны». Шаг «Анализы» — это уже
 * утверждённая страница /lab/selected, здесь он отмечен пройденным.
 * Список анализов — то же хранилище выбора, что в каталоге (второго нет).
 * Расписание — процедурного кабинета, не врача.
 */
export function BookingLabFlow({ catalog, clinicAddress }: BookingLabFlowProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const stored = labDraftStore.useValue();
  const draft = ready ? stored : null;
  const selection = useSelection(catalog);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = labDraftStore.get();
    if (!current || params.get("draft") !== current.id) {
      const created = { id: newDraftId(), flow: "lab" as const, step: "datetime" as const };
      labDraftStore.set(created);
      syncDraftIdToUrl(created.id);
    }
    // Черновик и выбранные анализы читаются из хранилища браузера — только после гидратации.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
  }, []);

  const { patch, reserve, dropReservation, exit } = useBookingMechanics(
    labDraftStore,
    draft,
    LAB_TARGET,
    WITH_RESERVATION,
  );

  if (!draft) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-6 xl:px-0">
        <LoadingState label="Загружаем запись" />
      </div>
    );
  }

  const goBack = () => {
    if (draft.step === "confirm") patch({ step: "patient" });
    else if (draft.step === "patient") patch({ step: "datetime" });
    else exit();
  };

  // Пока анализы не выбраны, текущий шаг — «Анализы».
  const stepper = (
    <BookingStepper onBack={goBack} steps={stepperSteps(selection.count === 0 ? "analyses" : draft.step)} />
  );

  // После записи список выбранных очищен — показываем состав, зафиксированный при подтверждении.
  if (draft.step === "done" && draft.date && draft.time) {
    const booked = catalog.filter(({ analysis }) => draft.bookedAnalysisIds?.includes(analysis.id));
    const total = booked.reduce((sum, { analysis }) => sum + analysis.price.amount, 0);
    return (
      <BookingFrame stepper={null} narrow>
        <BookingSuccess
          message={`Запись на анализы подтверждена. Ждём вас ${formatLongDate(draft.date).split(",")[0]} в ${draft.time}.`}
          rows={[
            { label: "Анализы", value: booked.map(({ analysis }) => analysis.title).join(", ") },
            { label: "Дата и время", value: `${formatLongDate(draft.date)} · ${draft.time}` },
            { label: "Адрес", value: clinicAddress },
            { label: "Стоимость", value: `${formatRub(total)} · оплата в клинике` },
          ]}
        />
      </BookingFrame>
    );
  }

  // Без выбранных анализов дальше идти нельзя.
  if (selection.count === 0) {
    return (
      <BookingFrame stepper={stepper}>
        <div className="mx-auto max-w-[520px] rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-5 py-10 shadow-(--shadow-s)">
          <EmptyState
            icon="flask"
            titleAs="h1"
            title="Выберите анализы"
            description="Добавьте исследования из каталога — после этого можно выбрать дату и время."
            action={<Button href={routes.lab}>Выбрать анализы</Button>}
          />
        </div>
      </BookingFrame>
    );
  }

  const items: SummaryItem[] = selection.items.map(({ analysis }) => ({
    id: analysis.id,
    title: analysis.title,
    price: analysis.price,
    note: analysis.preparation,
  }));
  const countText = countLabel(selection.count, WORDS.analysis);
  const fasting = selection.items.filter(({ analysis }) => needsFasting(analysis.preparation)).length;
  const slotLabel = draft.date && draft.time ? `${formatLongDate(draft.date)} · ${draft.time}` : null;

  const summary = (withTimer: boolean) => (
    <BookingSummary
      editHref={routes.labSelected}
      editLabel="Изменить состав"
      items={items.map((item) => ({ ...item, note: undefined }))}
      fields={[{ label: "Дата и время", value: slotLabel }]}
      total={{ label: countText, amount: selection.total }}
      footer={withTimer && draft.reservation && <ReservationTimer expiresAt={draft.reservation.expiresAt} />}
    />
  );

  if (draft.step === "datetime") {
    return (
      <BookingFrame
        stepper={stepper}
        aside={<div className="hidden lg:block">{summary(false)}</div>}
        bottomBar={
          draft.reservation &&
          draft.date && (
            <BookingBottomBar
              caption={`${formatShortDate(draft.date)} · ${draft.time}`}
              value={formatRub(selection.total)}
              action={<Button onClick={() => patch({ step: "patient" })}>Продолжить</Button>}
            />
          )
        }
      >
        <DateTimeStep
          target={LAB_TARGET}
          intro={
            fasting > 0 && (
              <Notice
                tone="info"
                icon="file-text"
                title={`${countLabel(fasting, WORDS.analysis)} ${fasting === 1 ? "сдаётся" : "сдаются"} натощак`}
                description="Удобнее выбрать утреннее время. Подробности подготовки — в карточке каждого анализа."
              />
            )
          }
          reservation={draft.reservation ?? null}
          onRequestedSlotHandled={() => undefined}
          notice={draft.notice}
          onDismissNotice={() => draft.notice && patch({ notice: undefined })}
          onReserve={reserve}
          onContinue={() => patch({ step: "patient" })}
        />
      </BookingFrame>
    );
  }

  if (draft.step === "patient" && draft.reservation) {
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

  if (draft.step === "confirm" && draft.reservation && draft.patient) {
    const reservation = draft.reservation;
    const patient = draft.patient;
    const analysisIds = selection.items.map(({ analysis }) => analysis.id);
    return (
      <BookingFrame stepper={stepper} narrow>
        <ConfirmStep
          reservation={reservation}
          total={{ label: `Итого · ${countText}`, amount: selection.total }}
          sections={[
            {
              title: `Анализы · ${selection.count}`,
              onEdit: () => router.push(routes.labSelected),
              items,
            },
            {
              title: "Визит",
              onEdit: () => patch({ step: "datetime" }),
              rows: [
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
            const result = await bookingService.createAppointment({
              target: LAB_TARGET,
              reservation,
              patient,
              analysisIds,
            });
            if (result.ok) {
              patch({
                step: "done",
                appointmentId: result.appointmentId,
                reservation: undefined,
                bookedAnalysisIds: analysisIds,
              });
              selectedAnalyses.clear();
            } else {
              dropReservation(result.reason === "expired" ? "expired" : "slot-unavailable");
            }
          }}
        />
      </BookingFrame>
    );
  }

  // Шаг без резерва (например, после обновления на «Данных» резерв уже истёк) — к выбору времени.
  return (
    <BookingFrame stepper={stepper}>
      <Notice
        tone="info"
        icon="clock"
        role="status"
        title="Выберите время ещё раз"
        description="Резерв времени закончился. Выбранные анализы сохранены."
        action={
          <Button variant="secondary" size="sm" onClick={() => patch({ step: "datetime" })}>
            Выбрать время
          </Button>
        }
      />
    </BookingFrame>
  );
}

function stepperSteps(current: LabStep | "analyses"): StepperStep[] {
  const currentIndex = current === "done" ? STEPS.length : STEPS.findIndex((item) => item.step === current);
  return STEPS.map(({ label }, index) => ({
    label,
    state: index === currentIndex ? "current" : index < currentIndex ? "done" : "upcoming",
  }));
}
