"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateBlocks";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/lib/auth-session";
import { formatCompactDate, formatShortDate } from "@/lib/dates";
import { formatRub } from "@/lib/format";
import { countLabel } from "@/lib/plural";
import { routes } from "@/lib/routes";
import type { AppointmentReferences } from "@/services/account";
import { appointmentService, compareByVisit, getAppointmentStatus } from "@/services/appointments";
import { serviceErrorMessage } from "@/services/errors";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { describeAppointment } from "./appointment-view";

const RECORDS: [string, string, string] = ["запись", "записи", "записей"];

interface Loaded {
  items: Array<{ appointment: Appointment; status: AppointmentStatus }>;
}

/**
 * «Мои записи» (Cabinet-Dashboard-*): ближайшая запись, будущие, прошедшие,
 * отменённые. Записи — те, что созданы через запись к врачу и на анализы
 * (appointmentService), других источников нет. Пусто — «Записей пока нет».
 */
export function AppointmentsDashboard({ references }: { references: AppointmentReferences }) {
  const auth = useAuth();
  const patient = auth.status === "authenticated" ? auth.patient : null;
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [failure, setFailure] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const patientId = patient?.id;
  useEffect(() => {
    if (!patientId) return;
    appointmentService
      .listForPatient(patientId)
      .then((appointments) => {
        // «Сейчас» фиксируется при загрузке: по нему делятся будущие и прошедшие.
        const now = new Date();
        setLoaded({ items: appointments.map((appointment) => ({ appointment, status: getAppointmentStatus(appointment, now) })) });
      })
      .catch((error: unknown) => setFailure(serviceErrorMessage(error)));
  }, [patientId, attempt]);

  if (!patient) return null;

  const pick = (status: AppointmentStatus) => loaded?.items.filter((item) => item.status === status) ?? [];
  const upcoming = pick("upcoming").sort((a, b) => compareByVisit(a.appointment, b.appointment));
  const past = pick("completed").sort((a, b) => compareByVisit(b.appointment, a.appointment));
  const cancelled = pick("cancelled").sort((a, b) => compareByVisit(b.appointment, a.appointment));
  const [nearest, ...future] = upcoming;
  const empty = loaded !== null && loaded.items.length === 0;

  return (
    <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
        <div>
          <h1 className="text-[24px] leading-[31px] font-bold text-(--color-text-primary) md:text-[32px] md:leading-10">
            {patient.name ? `Здравствуйте, ${patient.name}` : "Здравствуйте!"}
          </h1>
          <p className="mt-1.5 text-[14px] text-(--color-text-secondary) md:text-[16px]">
            <span className="md:hidden">Ваши записи на приём и на анализы.</span>
            <span className="hidden md:inline">Здесь — ваши записи на приём и на анализы.</span>
          </p>
        </div>
        {!empty && (
          <div className="flex flex-col gap-3 md:flex-row">
            <Button href={routes.booking} size="sm" fullWidth className="md:h-11 md:w-auto md:px-5 md:text-[16px]">
              Записаться к врачу
            </Button>
            <Button href={routes.lab} variant="secondary" size="sm" fullWidth className="md:h-11 md:w-auto md:px-5 md:text-[16px]">
              Записаться на анализы
            </Button>
          </div>
        )}
      </div>

      {loaded === null && !failure && <LoadingState label="Загружаем записи" className="mt-6 md:mt-7" />}
      {failure && (
        <ErrorState
          className="mt-6 md:mt-7"
          title="Не удалось загрузить записи"
          description={failure}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setFailure(null);
                setAttempt((value) => value + 1);
              }}
            >
              Повторить
            </Button>
          }
        />
      )}

      {empty && (
        <div className="mt-6 rounded-(--radius-l) bg-(--color-surface-page) px-4 py-8 md:mt-7 md:py-12">
          <EmptyState
            icon="calendar"
            titleAs="h2"
            title="Записей пока нет"
            description="Запишитесь к врачу или на анализы — это займёт пару минут."
            action={
              <>
                <Button href={routes.booking} size="sm">
                  Записаться к врачу
                </Button>
                <Button href={routes.lab} variant="secondary" size="sm">
                  Записаться на анализы
                </Button>
              </>
            }
          />
        </div>
      )}

      {nearest && <NearestCard item={nearest.appointment} references={references} />}

      <AppointmentSection title="Будущие записи" items={future} references={references} />
      <AppointmentSection title="Прошедшие записи" items={past} references={references} withTime={false} />
      <AppointmentSection title="Отменённые записи" items={cancelled} references={references} withTime={false} />
    </Container>
  );
}

/** Ближайшая предстоящая запись — акцентная карточка. */
function NearestCard({ item, references }: { item: Appointment; references: AppointmentReferences }) {
  const view = describeAppointment(item, references);
  return (
    <section
      aria-labelledby="nearest-title"
      className="mt-6 flex flex-col gap-3.5 rounded-(--radius-l) border border-(--color-border-accent) bg-(--color-surface-accent) p-[18px] md:mt-7 md:flex-row md:items-center md:gap-6 md:rounded-[18px] md:px-7 md:py-6"
    >
      {/* Один заголовок для скринридера; видимая подпись стоит в разных местах на mobile и desktop. */}
      <h2 id="nearest-title" className="sr-only">
        Ближайшая запись
      </h2>
      <p
        aria-hidden="true"
        className="text-[12px] font-bold tracking-[.05em] text-(--color-text-accent-on-tinted) uppercase md:hidden"
      >
        Ближайшая запись
      </p>
      <div className="flex min-w-0 items-start gap-3.5 md:flex-1 md:items-center md:gap-6">
        <span className="flex size-[52px] shrink-0 items-center justify-center rounded-(--radius-l) bg-(--color-surface-card) text-(--color-icon-plate-fg) md:size-[60px]">
          <Icon name={view.icon} size={26} />
        </span>
        <div className="min-w-0">
          <p aria-hidden="true" className="hidden text-[12px] font-bold tracking-[.05em] text-(--color-text-accent-on-tinted) uppercase md:block">
            Ближайшая запись
          </p>
          <p className="text-[17px] leading-[23px] font-bold text-(--color-text-primary) md:mt-1 md:text-[20px] md:leading-7">
            {view.title}
          </p>
          <p className="mt-0.5 text-[13px] text-(--color-text-secondary) md:text-[14px]">{view.subtitle}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-(--color-border-accent) pt-3.5 md:contents">
        <div className="md:shrink-0 md:text-right">
          <p className="text-[15px] font-bold text-(--color-text-primary) md:text-[17px]">
            <span className="md:hidden">{formatCompactDate(item.date)}</span>
            <span className="hidden md:inline">{formatShortDate(item.date)}</span> · {item.time}
          </p>
          <p className="text-[13px] text-(--color-text-secondary) md:mt-0.5 md:text-[14px]">{formatRub(item.price)}</p>
        </div>
        <Button href={routes.appointment(item.id)} variant="secondary" size="sm" className="shrink-0 md:h-11 md:px-5 md:text-[16px]">
          Подробнее<span className="sr-only">: {view.title}</span>
        </Button>
      </div>
    </section>
  );
}

function AppointmentSection({
  title,
  items,
  references,
  withTime = true,
}: {
  title: string;
  items: Array<{ appointment: Appointment; status: AppointmentStatus }>;
  references: AppointmentReferences;
  withTime?: boolean;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mt-7 md:mt-10">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[19px] font-bold text-(--color-text-primary)">{title}</h2>
        <span className="text-[14px] text-(--color-text-secondary)">
          <span className="md:hidden">{items.length}</span>
          <span className="hidden md:inline">{countLabel(items.length, RECORDS)}</span>
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-2.5 md:mt-3.5 md:gap-3">
        {items.map(({ appointment, status }) => (
          <AppointmentRow
            key={appointment.id}
            appointment={appointment}
            status={status}
            references={references}
            withTime={withTime}
          />
        ))}
      </ul>
    </section>
  );
}

/**
 * Строка записи (Appointment Row). Desktop (≥1024): всё в одну строку с колонками
 * даты и цены; mobile и планшет — карточка: название и статус, ниже дата, цена, «Подробнее».
 */
function AppointmentRow({
  appointment,
  status,
  references,
  withTime,
}: {
  appointment: Appointment;
  status: AppointmentStatus;
  references: AppointmentReferences;
  withTime: boolean;
}) {
  const view = describeAppointment(appointment, references);
  const time = withTime ? ` · ${appointment.time}` : "";
  const more = (
    <Link
      href={routes.appointment(appointment.id)}
      className="touch-target inline-flex shrink-0 items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline lg:text-[14px]"
    >
      Подробнее
      <span className="sr-only">
        : {view.title}, {formatShortDate(appointment.date)}
      </span>
      <Icon name="arrow-right" size={16} />
    </Link>
  );

  return (
    <li className="rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) p-3.5 lg:px-5 lg:py-[18px]">
      <div className="flex items-start gap-3 lg:items-center lg:gap-5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-m) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg) lg:size-11">
          <Icon name={view.icon} size={20} />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:gap-[3px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-[15px] leading-5 font-bold text-(--color-text-primary) lg:text-[16px]">{view.title}</h3>
            <span className="hidden lg:inline-flex">
              <StatusBadge status={status} />
            </span>
          </div>
          <p className="text-[13px] text-(--color-text-secondary) lg:text-[14px]">
            <span className="lg:hidden">{view.subtitleShort}</span>
            <span className="hidden lg:inline">{view.subtitle}</span>
          </p>
        </div>
        <span className="shrink-0 lg:hidden">
          <StatusBadge status={status} />
        </span>
        <p className="hidden w-[200px] shrink-0 text-[14px] text-(--color-text-secondary) lg:block">
          {formatShortDate(appointment.date)}
          {time}
        </p>
        <p className="hidden w-[110px] shrink-0 text-[16px] font-bold text-(--color-text-primary) lg:block">
          {formatRub(appointment.price)}
        </p>
        <span className="hidden lg:inline-flex">{more}</span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-(--color-border-decorative) pt-2.5 lg:hidden">
        <p className="text-[13px] text-(--color-text-secondary)">
          {formatCompactDate(appointment.date)}
          {time} · <b className="font-semibold text-(--color-text-primary)">{formatRub(appointment.price)}</b>
        </p>
        {more}
      </div>
    </li>
  );
}
