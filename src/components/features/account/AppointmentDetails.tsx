"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, LoadingState, Notice } from "@/components/ui/StateBlocks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/lib/auth-session";
import { formatCompactDate, formatLongDate } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { countLabel, WORDS } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { AppointmentReferences } from "@/services/account";
import { appointmentService, getAppointmentStatus } from "@/services/appointments";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { describeAppointment } from "./appointment-view";

type LoadState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; appointment: Appointment; status: AppointmentStatus };

/**
 * Детали записи (Cabinet-Details-*): услуга, врач или анализы, дата и время,
 * адрес, стоимость, статус. Чужая или несуществующая запись — «Запись не найдена».
 *
 * «Перенести» и «Отменить» показаны, как в Design v1, но пока не меняют запись:
 * настоящая MOCK-механика — следующий этап (PD-06). По нажатию — нейтральное
 * сообщение, статус записи не трогается.
 */
export function AppointmentDetails({ id, references }: { id: string; references: AppointmentReferences }) {
  const auth = useAuth();
  const patientId = auth.status === "authenticated" ? auth.patient.id : null;
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [actionNotice, setActionNotice] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!patientId) return;
    appointmentService.getForPatient(patientId, id).then((appointment) =>
      setState(
        appointment
          ? { kind: "ready", appointment, status: getAppointmentStatus(appointment, new Date()) }
          : { kind: "missing" },
      ),
    );
  }, [patientId, id]);

  useEffect(() => {
    if (actionNotice) noticeRef.current?.focus();
  }, [actionNotice]);

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

  const { appointment, status } = state;
  const view = describeAppointment(appointment, references);
  const title = appointment.type === "lab" ? "Запись на анализы" : view.title;

  return (
    <Container className="pt-[18px] pb-10 md:pt-10 md:pb-16">
      <div className="max-w-[720px]">
        {back}
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

        {status === "upcoming" && (
          <>
            <div className="mt-4 flex flex-col gap-2 md:mt-5 md:flex-row md:items-center md:gap-6">
              <Button variant="secondary" fullWidth className="md:w-auto" onClick={() => setActionNotice(true)}>
                Перенести запись
              </Button>
              <button
                type="button"
                onClick={() => setActionNotice(true)}
                className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 self-center rounded-(--radius-s) px-0.5 text-[15px] font-semibold text-(--color-text-error) hover:underline md:self-auto"
              >
                <Icon name="trash" size={17} />
                Отменить запись
              </button>
            </div>
            {actionNotice && (
              <div ref={noticeRef} tabIndex={-1} className="mt-4 outline-none">
                <Notice
                  tone="neutral"
                  icon="alert"
                  role="status"
                  title="Пока недоступно на сайте"
                  description="Перенос и отмена записи онлайн появятся в следующей версии. Ваша запись остаётся в силе."
                />
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-t border-(--color-border-decorative) py-[11px] md:gap-6 md:py-3.5">
      <dt className="text-[14px] text-(--color-text-secondary) md:text-[15px]">{label}</dt>
      <dd className="text-right text-[14px] font-semibold text-(--color-text-primary) md:text-[15px]">{children}</dd>
    </div>
  );
}
