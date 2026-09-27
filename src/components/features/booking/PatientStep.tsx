"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { OtpCodeField, OtpFailure } from "@/components/features/auth/OtpCodeField";
import { useOtpFlow } from "@/components/features/auth/use-otp-flow";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { LoadingState } from "@/components/ui/StateBlocks";
import { authSession, useAuth } from "@/lib/auth-session";
import { maskPhone, phoneValidationError } from "@/lib/phone";
import type { PatientContact } from "@/services/booking/types";
import { serviceErrorMessage } from "@/services/errors";
import { StepTitle } from "./BookingFrame";

interface PatientStepProps {
  initial?: PatientContact;
  /** Номер уже подтверждён в этой записи (вернулись по «Изменить»). */
  initiallyVerified?: boolean;
  /** Пациент вошёл — сохраняем имя и телефон и идём к подтверждению записи. */
  onComplete: (patient: PatientContact) => void;
}

const nameError = (name: string) => (name.trim().length < 2 ? "Введите имя" : undefined);

/**
 * «Данные / авторизация» (PD-01): имя и телефон → код из смс → пациент вошёл.
 * Пароля нет. Вход общий для всего сайта (authSession): подтвердив номер здесь,
 * пациент уже авторизован в шапке и кабинете. Если он уже вошёл — «Вы вошли как …»
 * без повторного кода; если в профиле нет имени — спрашиваем только имя.
 */
export function PatientStep({ initial, initiallyVerified = false, onComplete }: PatientStepProps) {
  const auth = useAuth();
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phoneDigits ?? "");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [savingName, setSavingName] = useState(false);
  const continueRef = useRef<HTMLDivElement>(null);
  const flow = useOtpFlow({ initiallyVerified, details: () => ({ name: name.trim() }) });

  // Вернулись по «Изменить», но сессии уже нет (вышли в другой вкладке) — подтверждаем заново.
  const returning = flow.phase === "verified" && flow.code.length === 0;
  const { reset } = flow;
  useEffect(() => {
    if (returning && auth.status === "guest") reset();
  }, [returning, auth.status, reset]);

  // Номер подтвердили — фокус на «Продолжить», чтобы с клавиатуры идти дальше.
  const justVerified = flow.phase === "verified" && flow.code.length > 0;
  useEffect(() => {
    if (justVerified) continueRef.current?.querySelector("button")?.focus();
  }, [justVerified]);

  if (auth.status === "loading") return <LoadingState label="Проверяем вход" className="max-w-[560px]" />;

  const signedIn = auth.status === "authenticated" && (flow.phase === "idle" || returning);

  // Уже вошёл, имя известно — повторный код не нужен.
  if (signedIn && auth.patient.name) {
    const patient = { name: auth.patient.name, phoneDigits: auth.patient.phoneDigits };
    return (
      <div className="flex max-w-[560px] flex-col gap-5">
        <StepTitle>Ваши данные</StepTitle>
        <SignedInCard phoneDigits={patient.phoneDigits} title={`Вы вошли как ${patient.name}`}>
          <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">
            Подтверждать номер ещё раз не нужно — сразу к проверке записи.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button onClick={() => onComplete(patient)}>Продолжить</Button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setPhone("");
                authSession.logout();
              }}
              className="touch-target cursor-pointer rounded-(--radius-s) text-[14px] font-semibold text-(--color-text-link-strong) hover:underline"
            >
              Не вы? Сменить номер
            </button>
          </div>
        </SignedInCard>
      </div>
    );
  }

  // Вошёл через /login и имя ещё не указал — спрашиваем только имя (FACT 2.4: имя обязательно).
  if (signedIn) {
    const phoneDigits = auth.patient.phoneDigits;
    return (
      <form
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          const problem = nameError(name);
          setErrors({ name: problem });
          if (problem) return;
          setSavingName(true);
          try {
            const patient = await authSession.updateProfile({ name });
            onComplete({ name: patient.name ?? name.trim(), phoneDigits });
          } catch (error) {
            setErrors({ name: serviceErrorMessage(error) });
          } finally {
            setSavingName(false);
          }
        }}
        className="flex max-w-[560px] flex-col gap-5"
      >
        <StepTitle lead="Номер уже подтверждён — осталось указать имя.">Ваши данные</StepTitle>
        <SignedInCard phoneDigits={phoneDigits} title="Вы вошли по номеру">
          <Input
            label="Имя"
            required
            autoComplete="given-name"
            value={name}
            error={errors.name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) setErrors({});
            }}
          />
          <Button type="submit" loading={savingName} className="self-start">
            Продолжить
          </Button>
        </SignedInCard>
      </form>
    );
  }

  const { phase } = flow;
  const inCodePhase = flow.inCodePhase && !returning;

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (phase === "idle") {
          const problems = { name: nameError(name), phone: phoneValidationError(phone) };
          setErrors(problems);
          if (!problems.name && !problems.phone) flow.send(phone);
        }
        if (phase === "verified") onComplete({ name: name.trim(), phoneDigits: phone });
      }}
      className="flex max-w-[560px] flex-col gap-5"
    >
      <StepTitle lead="Подтвердите номер — это займёт меньше минуты. Пароль не нужен.">Ваши данные</StepTitle>

      <Input
        label="Имя"
        required
        autoComplete="given-name"
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value);
          if (errors.name) setErrors((current) => ({ ...current, name: undefined }));
        }}
      />

      <PhoneInput
        label="Телефон"
        required
        digits={phone}
        readOnly={inCodePhase || phase === "sending"}
        error={errors.phone}
        onDigitsChange={(digits) => {
          setPhone(digits);
          if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
        }}
        hint={
          inCodePhase && (
            <>
              {phase === "verified" ? "Номер подтверждён" : "Отправили код на этот номер"} ·{" "}
              <button
                type="button"
                onClick={flow.reset}
                className="cursor-pointer font-semibold text-(--color-text-link-strong) hover:underline"
              >
                Изменить номер
              </button>
            </>
          )
        }
      />

      {(phase === "idle" || phase === "sending") && (
        <>
          <Button type="submit" size="md" loading={phase === "sending"} className="w-full md:w-auto md:self-start">
            Получить код
          </Button>
          {flow.failure && <OtpFailure message={flow.failure} />}
          <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">
            Код проверится автоматически, как только введёте последнюю цифру. Если вы у нас впервые, профиль создастся
            сам.
          </p>
        </>
      )}

      {inCodePhase && (
        <OtpCodeField
          flow={flow}
          hint="Код проверится автоматически, как только введёте последнюю цифру. Если вы у нас впервые, профиль создастся сам."
        />
      )}

      {phase === "verified" && (
        <div ref={continueRef}>
          <Button type="submit" size="md" className="w-full md:h-[52px] md:w-auto md:px-6 md:text-[18px]">
            Продолжить
          </Button>
        </div>
      )}
    </form>
  );
}

function SignedInCard({ title, phoneDigits, children }: { title: string; phoneDigits: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3.5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-4 md:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-pill) border border-(--color-border-decorative) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)">
          <Icon name="user" size={20} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold break-words text-(--color-text-primary)">{title}</p>
          <p className="text-[13px] text-(--color-text-secondary) tabular-nums">{maskPhone(phoneDigits)}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
