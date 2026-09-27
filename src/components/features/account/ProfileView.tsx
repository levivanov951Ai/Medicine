"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { authSession, useAuth } from "@/lib/auth-session";
import { maskPhone } from "@/lib/phone";
import { serviceErrorMessage } from "@/services/errors";

/**
 * Профиль (Cabinet-Profile-*): имя, телефон, выход.
 *
 * - Имя можно изменить — сохраняется в профиль, шапка обновляется сразу.
 * - Телефон только показывается: смена номера через новый код — FUTURE (PD-21).
 * - Блок «Уведомления» из макета не входит в MVP (PD-27, PROJECT_CONTEXT.md):
 *   смс-провайдер не выбран, сроки напоминаний клиникой не подтверждены —
 *   обещания конкретных сроков в интерфейсе не показываются.
 * - Медицинских данных в профиле нет (PD-09).
 */
export function ProfileView() {
  const auth = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const editRef = useRef<HTMLButtonElement>(null);
  const wasEditing = useRef(false);

  // После «Сохранить» / «Отмена» фокус возвращается на «Изменить».
  useEffect(() => {
    if (wasEditing.current && !editing) editRef.current?.focus();
    wasEditing.current = editing;
  }, [editing]);

  if (auth.status !== "authenticated") return null;
  const { patient } = auth;

  const startEditing = () => {
    setDraft(patient.name ?? "");
    setError(undefined);
    setSaved(false);
    setEditing(true);
  };

  const save = async () => {
    if (draft.trim().length < 2) {
      setError("Введите имя");
      return;
    }
    setSaving(true);
    try {
      await authSession.updateProfile({ name: draft });
    } catch (failure) {
      setError(serviceErrorMessage(failure));
      return;
    } finally {
      setSaving(false);
    }
    setEditing(false);
    setSaved(true);
  };

  return (
    <Container className="pt-[18px] pb-10 md:pt-10 md:pb-16">
      <h1 className="text-[24px] leading-[31px] font-bold text-(--color-text-primary) md:text-[32px] md:leading-10">
        Профиль
      </h1>
      <p className="mt-1.5 text-[13px] leading-[19px] text-(--color-text-secondary) md:text-[15px] md:leading-normal">
        <span className="md:hidden">Только основные данные — медицинская история сюда не входит.</span>
        <span className="hidden md:inline">
          Только основные данные — медицинская история и результаты анализов сюда не входят.
        </span>
      </p>

      <section aria-labelledby="profile-main" className="mt-5 flex max-w-[560px] flex-col gap-2 md:mt-7 md:gap-2.5">
        <h2
          id="profile-main"
          className="text-[12px] font-bold tracking-[.05em] text-(--color-text-secondary) uppercase md:text-[13px]"
        >
          Основные данные
        </h2>
        <div className="rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) px-4 py-1 shadow-(--shadow-s) md:px-7 md:py-2">
          {editing ? (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
              className="flex flex-col gap-3.5 py-3.5 md:gap-4 md:py-4"
            >
              <Input
                label="Имя"
                required
                autoFocus
                autoComplete="given-name"
                value={draft}
                error={error}
                onChange={(event) => {
                  setDraft(event.target.value);
                  if (error) setError(undefined);
                }}
              />
              <div className="flex gap-2.5 md:gap-3">
                <Button type="submit" loading={saving} className="flex-1 md:flex-none">
                  Сохранить
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)} className="flex-1 md:flex-none">
                  Отмена
                </Button>
              </div>
            </form>
          ) : (
            <ProfileRow
              label="Имя"
              value={patient.name ?? "Не указано"}
              muted={!patient.name}
              action={
                <button
                  ref={editRef}
                  type="button"
                  onClick={startEditing}
                  className="touch-target inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-(--radius-s) text-[13px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline md:text-[14px]"
                >
                  {patient.name ? "Изменить" : "Указать"}
                  <span className="sr-only"> имя</span>
                  <Icon name="arrow-right" size={16} />
                </button>
              }
            />
          )}
          <ProfileRow
            label="Телефон"
            value={<span className="tabular-nums">{maskPhone(patient.phoneDigits)}</span>}
            note="Сменить номер на сайте пока нельзя — это появится позже."
            bordered
          />
        </div>
        <p aria-live="polite" className="text-[13px] font-semibold text-(--color-text-success)">
          {saved && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check-circle" size={16} />
              Имя сохранено
            </span>
          )}
        </p>
      </section>

      <div className="mt-5 max-w-[560px] border-t border-(--color-border-decorative) pt-3 md:mt-7 md:pt-5">
        <button
          type="button"
          onClick={() => authSession.logout()}
          className="inline-flex min-h-11 cursor-pointer items-center rounded-(--radius-s) text-[14px] font-semibold text-(--color-text-error) hover:underline md:text-[15px]"
        >
          Выйти из личного кабинета
        </button>
      </div>
    </Container>
  );
}

function ProfileRow({
  label,
  value,
  note,
  action,
  muted = false,
  bordered = false,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  action?: ReactNode;
  muted?: boolean;
  bordered?: boolean;
}) {
  return (
    <div
      className={
        bordered
          ? "flex items-center justify-between gap-4 border-t border-(--color-border-decorative) py-3.5 md:py-4"
          : "flex items-center justify-between gap-4 py-3.5 md:py-4"
      }
    >
      <div className="min-w-0">
        <p className="text-[13px] text-(--color-text-secondary)">{label}</p>
        <p
          className={
            muted
              ? "mt-0.5 text-[15px] font-semibold text-(--color-text-secondary) md:text-[16px]"
              : "mt-0.5 text-[15px] font-semibold break-words text-(--color-text-primary) md:text-[16px]"
          }
        >
          {value}
        </p>
        {note && <p className="mt-1 text-[13px] leading-[18px] text-(--color-text-secondary)">{note}</p>}
      </div>
      {action}
    </div>
  );
}
