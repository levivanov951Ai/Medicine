"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { LoadingState, Notice } from "@/components/ui/StateBlocks";
import { useAuth } from "@/lib/auth-session";
import { maskPhone, phoneValidationError } from "@/lib/phone";
import { routes } from "@/lib/routes";
import { OtpCodeField, OtpFailure } from "./OtpCodeField";
import { useOtpFlow } from "./use-otp-flow";

interface LoginViewProps {
  /** Куда вернуть после входа — уже проверенный внутренний адрес (safeReturnPath). */
  returnTo: string | null;
}

/** Пауза на «Готово, …!» перед переходом — чтобы успех был заметен и прочитан. */
const SUCCESS_PAUSE_MS = 900;

/**
 * Вход в личный кабинет (Cabinet-Login-*): телефон → код из смс → кабинет.
 * Регистрации и пароля нет (PD-01): новый номер — профиль создаётся сам,
 * известный — открывается прежний. Поле телефона, ячейки кода, повторная
 * отправка и проверка — те же, что в записи (useOtpFlow, OtpCodeField).
 *
 * Desktop — карточка «Шаг 1 / Шаг 2»; mobile — без карточки, на шаге кода
 * заголовок «Введите код».
 */
export function LoginView({ returnTo }: LoginViewProps) {
  const router = useRouter();
  const auth = useAuth();
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const flow = useOtpFlow();
  const doneRef = useRef<HTMLParagraphElement>(null);
  const target = returnTo ?? routes.account;

  const alreadySignedIn = auth.status === "authenticated" && flow.phase === "idle";
  const verified = flow.phase === "verified";

  // Уже вошёл — сразу в кабинет, без повторного кода.
  useEffect(() => {
    if (alreadySignedIn) router.replace(target);
  }, [alreadySignedIn, router, target]);

  // Код подтверждён — «Готово!» и переход туда, куда пациент шёл.
  useEffect(() => {
    if (!verified) return;
    doneRef.current?.focus();
    const timeout = window.setTimeout(() => router.replace(target), SUCCESS_PAUSE_MS);
    return () => window.clearTimeout(timeout);
  }, [verified, router, target]);

  const codeStep = flow.inCodePhase;
  const name = auth.status === "authenticated" ? auth.patient.name : null;

  const changeNumber = (
    <button
      type="button"
      onClick={flow.reset}
      className="touch-target cursor-pointer rounded-(--radius-s) font-semibold text-(--color-text-link-strong) hover:underline"
    >
      Изменить<span className="hidden md:inline"> номер</span>
    </button>
  );

  let body;
  if (auth.status === "loading") {
    body = <LoadingState label="Проверяем вход" />;
  } else if (alreadySignedIn) {
    body = (
      <Notice
        tone="info"
        icon="check-circle"
        role="status"
        title="Вы уже вошли"
        description="Открываем личный кабинет без повторного запроса кода."
      />
    );
  } else if (verified) {
    body = (
      <div className="flex flex-col items-center gap-2.5 py-2 text-center">
        <span className="flex size-14 items-center justify-center rounded-(--radius-pill) bg-(--color-surface-success) text-(--color-text-success)">
          <Icon name="check" size={28} />
        </span>
        <p
          ref={doneRef}
          tabIndex={-1}
          role="status"
          className="text-[15px] font-semibold text-(--color-text-primary) outline-none"
        >
          {name ? `Готово, ${name}!` : "Готово!"}
        </p>
        <p className="text-[13px] text-(--color-text-secondary)">Переходим в личный кабинет…</p>
      </div>
    );
  } else if (codeStep) {
    body = (
      <div className="flex flex-col gap-5">
        <div className="hidden flex-col gap-1 md:flex">
          <h2 className="text-[18px] font-bold text-(--color-text-primary)">Шаг 2 · Код из смс</h2>
          <p className="text-[14px] text-(--color-text-secondary)">
            Отправили код на <span className="tabular-nums">{maskPhone(flow.sentTo)}</span> · {changeNumber}
          </p>
        </div>
        <OtpCodeField
          flow={flow}
          hint="Код проверится сам, как только введёте последнюю цифру. Пароль не нужен ни на одном шаге."
        />
      </div>
    );
  } else {
    body = (
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          const problem = phoneValidationError(phone);
          setPhoneError(problem);
          if (!problem) flow.send(phone);
        }}
        className="flex flex-col gap-5"
      >
        <div className="hidden flex-col gap-1 md:flex">
          <h2 className="text-[18px] font-bold text-(--color-text-primary)">Шаг 1 · Номер телефона</h2>
          <p className="text-[14px] text-(--color-text-secondary)">
            Если вы уже записывались к нам — откроется ваш профиль. Если нет — он создастся автоматически.
          </p>
        </div>
        <PhoneInput
          label="Телефон"
          required
          digits={phone}
          readOnly={flow.phase === "sending"}
          error={phoneError}
          onDigitsChange={(digits) => {
            setPhone(digits);
            if (phoneError) setPhoneError(undefined);
          }}
        />
        <Button type="submit" fullWidth loading={flow.phase === "sending"}>
          Получить код
        </Button>
        {flow.failure && <OtpFailure message={flow.failure} />}
      </form>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-10 md:px-6 md:pt-14 md:pb-16 xl:px-0">
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col gap-1.5 md:gap-2">
          <p
            className={
              codeStep && !verified
                ? "hidden text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase md:block"
                : "text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase"
            }
          >
            Вход
          </p>
          <h1 className="text-[26px] leading-[33px] font-bold text-(--color-text-primary) md:text-[36px] md:leading-[44px]">
            {codeStep && !verified ? (
              <>
                <span className="md:hidden">Введите код</span>
                <span className="hidden md:inline">Личный кабинет</span>
              </>
            ) : (
              "Личный кабинет"
            )}
          </h1>
          {codeStep && !verified ? (
            <>
              <p className="text-[15px] leading-[22px] text-(--color-text-secondary) md:hidden">
                Отправили на <span className="tabular-nums">{maskPhone(flow.sentTo)}</span> · {changeNumber}
              </p>
              <p className="hidden text-[17px] leading-[26px] text-(--color-text-secondary) md:block">
                Войдите по номеру телефона — регистрация отдельно не нужна.
              </p>
            </>
          ) : (
            <p className="text-[15px] leading-[22px] text-(--color-text-secondary) md:text-[17px] md:leading-[26px]">
              Войдите по номеру телефона — регистрация<span className="hidden md:inline"> отдельно</span> не нужна.
            </p>
          )}
        </div>

        <div className="w-full md:max-w-[440px] md:rounded-(--radius-l) md:border md:border-(--color-border-decorative) md:bg-(--color-surface-card) md:p-7 md:shadow-(--shadow-s)">
          {body}
        </div>
      </div>
    </section>
  );
}
