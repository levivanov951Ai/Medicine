"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, ErrorState, LoadingState, Notice } from "@/components/ui/StateBlocks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/lib/auth-session";
import { formatCompactDate, formatDayMonthFromIso, formatLongDate } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { AppointmentReferences } from "@/services/account";
import { appointmentService, getAppointmentStatus } from "@/services/appointments";
import { serviceErrorMessage } from "@/services/errors";
import type { Appointment, AppointmentActions, AppointmentStatus } from "@/types/appointment";
import { describeAppointment } from "./appointment-view";

type LoadState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "error"; message: string }
  | { kind: "ready"; appointment: Appointment; status: AppointmentStatus; actions: AppointmentActions };

/** Что изменилось — сообщение после отмены или переноса. */
export type AppointmentUpdate = "cancelled" | "rescheduled";

interface AppointmentDetailsProps {
  id: string;
  references: AppointmentReferences;
  /** Перенос только что подтверждён (?updated=rescheduled). */
  initialUpdate?: AppointmentUpdate | null;
}

/**
 * Детали записи (Cabinet-Details-*): услуга, врач или анализы, дата и время,
 * адрес, стоимость, статус. Чужая или несуществующая запись — «Запись не найдена».
 *
 * «Перенести» и «Отменить» доступны, если это разрешает источник данных
 * (appointmentService.getActions: сейчас демо-правило, позже — CRM).
 * Отмена — через окно подтверждения (desktop — модалка, mobile — нижний лист);
 * запись остаётся в истории со статусом «Отменена». Перенос — отдельный экран.
 */
export function AppointmentDetails({ id, references, initialUpdate = null }: AppointmentDetailsProps) {
  const auth = useAuth();
  const patientId = auth.status === "authenticated" ? auth.patient.id : null;
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [update, setUpdate] = useState<AppointmentUpdate | null>(initialUpdate);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(false);
  const updateRef = useRef<HTMLDivElement>(null);

  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!patientId) return;
    loadAppointment(patientId, id)
      .then(setState)
      .catch((error: unknown) => setState({ kind: "error", message: serviceErrorMessage(error) }));
  }, [patientId, id, attempt]);

  // Сообщение о переносе показано — убираем ?updated= из адреса, чтобы не повторять его после обновления.
  useEffect(() => {
    if (initialUpdate) window.history.replaceState(window.history.state, "", routes.appointment(id));
  }, [initialUpdate, id]);

  // Запись изменилась — фокус на сообщение, чтобы его сразу прочитали.
  const ready = state.kind === "ready";
  useEffect(() => {
    if (update && ready) updateRef.current?.focus();
  }, [update, ready]);

  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    setCancelError(false);
  }, []);

  const cancel = async () => {
    if (!patientId) return;
    setCancelling(true);
    setCancelError(false);
    let result;
    try {
      result = await appointmentService.cancel(patientId, id);
    } catch {
      result = null;
    }
    setCancelling(false);
    if (!result?.ok) return setCancelError(true);
    setConfirmOpen(false);
    setUpdate("cancelled");
    // Отмена прошла; не удалось перечитать запись — показываем её с новым статусом.
    setState(
      await loadAppointment(patientId, id).catch(
        (): LoadState => ({ kind: "ready", appointment: result.appointment, status: "cancelled", actions: NO_ACTIONS }),
      ),
    );
  };

  const back = (
    <Link
      href={routes.account}
      className="touch-target inline-flex items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold text-(--color-text-link-strong) hover:underline md:text-[14px]"
    >
      <Icon name="chevron-left" size={16} />
      Все записи
    </Link>
  );

  if (state.kind === "loading") {
    return (
      <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
        <div className="max-w-[720px]">
          {back}
          <LoadingState label="Загружаем запись" className="mt-4" />
        </div>
      </Container>
    );
  }

  if (state.kind === "error") {
    return (
      <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
        <div className="max-w-[720px]">
          {back}
          <ErrorState
            className="mt-4"
            title="Не удалось загрузить запись"
            description={state.message}
            action={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setState({ kind: "loading" });
                  setAttempt((value) => value + 1);
                }}
              >
                Повторить
              </Button>
            }
          />
        </div>
      </Container>
    );
  }

  if (state.kind === "missing") {
    return (
      <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
        <div className="max-w-[720px]">
          {back}
          <div className="mt-4 rounded-(--radius-l) bg-(--color-surface-page) px-4 py-10">
            <EmptyState
              icon="calendar"
              titleAs="h1"
              title="Запись не найдена"
              description="Возможно, ссылка устарела или запись оформлена с другого номера."
              action={
                <Button href={routes.account} variant="secondary" size="sm">
                  Все записи
                </Button>
              }
            />
          </div>
        </div>
      </Container>
    );
  }

  const { appointment, status, actions } = state;
  const view = describeAppointment(appointment, references);
  const title = appointment.type === "lab" ? "Запись на анализы" : view.title;

  return (
    <Container className="pt-[18px] pb-10 md:pt-10 md:pb-16">
      <div className="max-w-[720px]">
        {back}
        {update && (
          <div ref={updateRef} tabIndex={-1} className="mt-3 outline-none md:mt-4">
            <Notice
              tone="info"
              icon="check-circle"
              role="status"
              title={update === "cancelled" ? "Запись отменена" : "Запись перенесена"}
              description={
                update === "cancelled"
                  ? "Запись осталась в истории. Время освободилось — при необходимости запишитесь заново."
                  : `Новое время — ${formatLongDate(appointment.date)}, ${appointment.time}. Остальное без изменений.`
              }
              action={
                update === "cancelled" && (
                  <Button href={appointment.type === "lab" ? routes.lab : routes.booking} variant="secondary" size="sm">
                    Записаться снова
                  </Button>
                )
              }
            />
          </div>
        )}
        <div className="mt-3 flex flex-col gap-2 md:mt-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-3">
          <h1 className="text-[22px] leading-7 font-bold text-(--color-text-primary) md:text-[30px] md:leading-[38px]">
            {title}
          </h1>
          <div>
            <StatusBadge status={status} />
          </div>
        </div>

        <dl className="mt-4 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-[18px] py-1.5 shadow-(--shadow-s) md:mt-5 md:px-7 md:py-2">
          {appointment.type === "doctor" ? (
            view.doctor && (
              <div className="py-3.5 md:py-4">
                <dt className="sr-only">Врач</dt>
                <dd className="flex min-w-0 items-center gap-3 md:gap-3.5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-pill) border border-(--color-border-decorative) bg-(--color-icon-plate-bg) text-(--color-icon-accent) md:size-12">
                    <Icon name="user" size={22} />
                  </span>
                  <span className="min-w-0">
                  <p className="text-[15px] font-semibold text-(--color-text-primary) md:text-[16px]">{view.doctor.name}</p>
                  <p className="text-[13px] text-(--color-text-secondary) md:text-[14px]">
                    <span className="md:hidden">{view.doctor.specialty}</span>
                    <span className="hidden md:inline">{view.doctor.specialtyFull}</span>
                  </p>
                  </span>
                </dd>
              </div>
            )
          ) : (
            <div className="py-3.5 md:py-4">
              <dt className="sr-only">Анализы</dt>
              <dd className="flex min-w-0 items-center gap-3 md:gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-pill) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg) md:size-12">
                  <Icon name="flask" size={22} />
                </span>
                <span className="min-w-0">
                <p className="text-[15px] font-semibold text-(--color-text-primary) md:text-[16px]">
                  {countLabel(appointment.analysisIds.length, WORDS.analysis)}
                </p>
                <p className="text-[13px] text-(--color-text-secondary) md:text-[14px]">{view.analyses.join(", ")}</p>
                </span>
              </dd>
            </div>
          )}
          <DetailRow label="Дата и время">
            <span className="md:hidden">{formatCompactDate(appointment.date)}</span>
            <span className="hidden md:inline">{formatLongDate(appointment.date)}</span> · {appointment.time}
          </DetailRow>
          <DetailRow label="Адрес">{appointment.clinicAddress}</DetailRow>
          <DetailRow label="Стоимость">
            {formatRub(appointment.price)} · <span className="md:hidden">в клинике</span>
            <span className="hidden md:inline">оплата в клинике</span>
          </DetailRow>
        </dl>

        {(actions.canCancel || actions.canReschedule) && (
          <div className="mt-4 flex flex-col gap-2 md:mt-5 md:flex-row md:items-center md:gap-6">
            {actions.canReschedule && (
              <Button href={routes.rescheduleAppointment(appointment.id)} variant="secondary" fullWidth className="md:w-auto">
                Перенести запись
              </Button>
            )}
            {actions.canCancel && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 self-center rounded-(--radius-s) px-0.5 text-[15px] font-semibold text-(--color-text-error) hover:underline md:self-auto"
              >
                <Icon name="trash" size={17} />
                Отменить запись
              </button>
            )}
          </div>
        )}
        {actions.restrictionReason && (
          <p className="mt-4 text-[14px] leading-5 text-(--color-text-secondary)">{actions.restrictionReason}</p>
        )}

        <Dialog
          open={confirmOpen}
          onClose={closeConfirm}
          busy={cancelling}
          title="Отменить запись?"
          description={
            <>
              <p>
                {appointment.type === "lab" ? "Запись на анализы" : "Приём"} {formatDayMonthFromIso(appointment.date)},{" "}
                {appointment.time} будет {appointment.type === "lab" ? "отменена" : "отменён"}. Отменённую запись нельзя
                восстановить — при необходимости можно будет записаться заново.
              </p>
              {cancelError && (
                <p role="alert" className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-(--color-text-error)">
                  <Icon name="alert" size={14} />
                  Не удалось отменить запись. Попробуйте ещё раз.
                </p>
              )}
            </>
          }
        >
          <Button variant="secondary" autoFocus disabled={cancelling} onClick={closeConfirm} fullWidth className="md:w-auto">
            Не отменять
          </Button>
          <Button variant="destructive" loading={cancelling} onClick={cancel} fullWidth className="md:w-auto">
            Да, отменить запись
          </Button>
        </Dialog>
      </div>
    </Container>
  );
}

const NO_ACTIONS: AppointmentActions = { canCancel: false, canReschedule: false, restrictionReason: null };

/** Запись пациента, её статус и доступные действия. */
async function loadAppointment(patientId: string, id: string): Promise<LoadState> {
  const appointment = await appointmentService.getForPatient(patientId, id);
  if (!appointment) return { kind: "missing" };
  const actions = await appointmentService.getActions(appointment);
  return { kind: "ready", appointment, status: getAppointmentStatus(appointment, new Date()), actions };
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-t border-(--color-border-decorative) py-[11px] md:gap-6 md:py-3.5">
      <dt className="text-[14px] text-(--color-text-secondary) md:text-[15px]">{label}</dt>
      <dd className="text-right text-[14px] font-semibold text-(--color-text-primary) md:text-[15px]">{children}</dd>
    </div>
  );
}
