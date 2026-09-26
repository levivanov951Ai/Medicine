"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { OtpInput, type OtpState } from "@/components/ui/OtpInput";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { Notice } from "@/components/ui/StateBlocks";
import { mockPatientSession } from "@/lib/booking-draft";
import { isCompletePhone, maskPhone } from "@/lib/phone";
import { bookingService } from "@/services/booking";
import type { PatientContact } from "@/services/booking/types";
import { StepTitle } from "./BookingFrame";

/** Демонстрационный режим (PD-26). По умолчанию выключен — тестовый код не показывается. */
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

type Phase = "form" | "sending" | "code" | "verifying" | "invalid" | "verified";

interface PatientStepProps {
  initial?: PatientContact;
  /** Номер уже подтверждён в этой записи (вернулись по «Изменить»). */
  initiallyVerified?: boolean;
  /** Номер подтверждён — сохраняем пациента и идём к подтверждению записи. */
  onComplete: (patient: PatientContact) => void;
}

/**
 * «Данные / авторизация» (PD-01): имя и телефон → код из смс → пациент подтверждён.
 * Пароля нет. Если номер уже подтверждали в этой вкладке — «Вы вошли как …»
 * без повторного кода. Код проверяет bookingService — сейчас это MOCK
 * без отправки смс, позже — настоящий сервис авторизации с тем же контрактом.
 */
export function PatientStep({ initial, initiallyVerified = false, onComplete }: PatientStepProps) {
  const session = mockPatientSession.useValue();
  const [useSession, setUseSession] = useState(true);
  const [name, setName] = useState(initial?.name ?? "");
  const [phone, setPhone] = useState(initial?.phoneDigits ?? "");
  const [nameError, setNameError] = useState<string>();
  const [phoneError, setPhoneError] = useState<string>();
  const [phase, setPhase] = useState<Phase>(initiallyVerified ? "verified" : "form");
  const [code, setCode] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const codeLabelId = useId();
  const codeStatusId = useId();
  const continueRef = useRef<HTMLDivElement>(null);

  const inCodePhase = phase === "code" || phase === "verifying" || phase === "invalid" || phase === "verified";
  // Вернулись к шагу по «Изменить», номер уже подтверждён — ячейки кода не нужны.
  const showOtp = inCodePhase && !(phase === "verified" && code.length === 0);
  const secondsLeft = Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (phase !== "code" && phase !== "invalid") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // Номер подтвердили — фокус на «Продолжить», чтобы с клавиатуры идти дальше.
  const justVerified = phase === "verified" && code.length > 0;
  useEffect(() => {
    if (justVerified) continueRef.current?.querySelector("button")?.focus();
  }, [justVerified]);

  const patient = (): PatientContact => ({ name: name.trim(), phoneDigits: phone });

  const requestCode = async () => {
    const nameProblem = name.trim().length < 2 ? "Введите имя" : undefined;
    const phoneProblem = isCompletePhone(phone) ? undefined : "Введите номер полностью — 10 цифр после +7";
    setNameError(nameProblem);
    setPhoneError(phoneProblem);
    if (nameProblem || phoneProblem) return;

    setPhase("sending");
    const { resendAfterSeconds } = await bookingService.sendOtp(phone);
    setCode("");
    setNow(Date.now());
    setResendAt(Date.now() + resendAfterSeconds * 1000);
    setPhase("code");
  };

  const changeCode = async (value: string) => {
    setCode(value);
    if (phase === "invalid") setPhase("code");
    if (value.length < bookingService.otpLength) return;
    setPhase("verifying");
    const result = await bookingService.verifyOtp(phone, value);
    if (result.ok) {
      setPhase("verified");
      mockPatientSession.set(patient());
    } else {
      setPhase("invalid");
    }
  };

  // Номер уже подтверждали в этой вкладке — повторный код не нужен.
  if (session && useSession && phase === "form") {
    return (
      <div className="flex max-w-[560px] flex-col gap-5">
        <StepTitle>Ваши данные</StepTitle>
        <div className="flex flex-col gap-3.5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-4 md:p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-pill) border border-(--color-border-decorative) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)">
              <Icon name="user" size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-(--color-text-primary)">Вы вошли как {session.name}</p>
              <p className="text-[13px] text-(--color-text-secondary) tabular-nums">{maskPhone(session.phoneDigits)}</p>
            </div>
          </div>
          <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">
            Подтверждать номер ещё раз не нужно — сразу к проверке записи.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Button onClick={() => onComplete(session)}>Продолжить</Button>
            <button
              type="button"
              onClick={() => {
                mockPatientSession.set(null);
                setUseSession(false);
              }}
              className="touch-target cursor-pointer rounded-(--radius-s) text-[14px] font-semibold text-(--color-text-link-strong) hover:underline"
            >
              Не вы? Сменить номер
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (phase === "form") requestCode();
        if (phase === "verified") onComplete(patient());
      }}
      className="flex max-w-[560px] flex-col gap-5"
    >
      <StepTitle lead="Подтвердите номер — это займёт меньше минуты. Пароль не нужен.">Ваши данные</StepTitle>

      <Input
        label="Имя"
        required
        autoComplete="given-name"
        value={name}
        error={nameError}
        onChange={(event) => {
          setName(event.target.value);
          if (nameError) setNameError(undefined);
        }}
      />

      <PhoneInput
        label="Телефон"
        required
        digits={phone}
        readOnly={inCodePhase || phase === "sending"}
        error={phoneError}
        onDigitsChange={(digits) => {
          setPhone(digits);
          if (phoneError) setPhoneError(undefined);
        }}
        hint={
          inCodePhase && (
            <>
              {phase === "verified" ? "Номер подтверждён" : "Отправили код на этот номер"} ·{" "}
              <button
                type="button"
                onClick={() => {
                  setPhase("form");
                  setCode("");
                }}
                className="cursor-pointer font-semibold text-(--color-text-link-strong) hover:underline"
              >
                Изменить номер
              </button>
            </>
          )
        }
      />

      {(phase === "form" || phase === "sending") && (
        <Button type="submit" size="md" loading={phase === "sending"} className="w-full md:w-auto md:self-start">
          Получить код
        </Button>
      )}

      {showOtp && (
        <div className="flex flex-col gap-2.5">
          <p id={codeLabelId} className="text-[14px] font-semibold text-(--color-text-primary)">
            Код из смс
          </p>
          <OtpInput
            length={bookingService.otpLength}
            value={code}
            onChange={changeCode}
            state={otpState(phase)}
            labelId={codeLabelId}
            describedBy={codeStatusId}
            autoFocus
          />
          <div id={codeStatusId} aria-live="polite">
            {phase === "invalid" && (
              <p className="flex items-center gap-1.5 text-[13px] leading-[18px] text-(--color-text-error)">
                <Icon name="alert" size={14} />
                Неверный код. Проверьте цифры или запросите новый
              </p>
            )}
            {phase === "verifying" && (
              <p className="flex items-center gap-2 text-[13px] text-(--color-text-secondary)">
                <Icon name="spinner" size={16} className="motion-safe:animate-spin" />
                Проверяем код…
              </p>
            )}
            {phase === "verified" && (
              <p className="flex items-center gap-1.5 text-[13px] font-semibold text-(--color-text-success)">
                <Icon name="check-circle" size={16} />
                Номер подтверждён
              </p>
            )}
          </div>
        </div>
      )}

      {(phase === "code" || phase === "invalid") &&
        (secondsLeft > 0 ? (
          <p className="text-[14px] text-(--color-text-secondary)">
            Отправить код повторно можно через{" "}
            <b className="text-(--color-text-primary) tabular-nums">
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </b>
          </p>
        ) : (
          <p className="flex flex-wrap items-center gap-2.5 text-[14px] text-(--color-text-secondary)">
            Код не пришёл?
            <button
              type="button"
              onClick={requestCode}
              className="touch-target inline-flex cursor-pointer items-center gap-1.5 rounded-(--radius-s) font-semibold text-(--color-text-link-strong) hover:underline"
            >
              Отправить ещё раз
              <Icon name="arrow-right" size={16} />
            </button>
          </p>
        ))}

      {phase !== "verified" && (
        <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">
          Код проверится автоматически, как только введёте последнюю цифру. Если вы у нас впервые, профиль создастся
          сам.
        </p>
      )}

      {/* PD-26: демо-код виден только при NEXT_PUBLIC_DEMO_MODE=true. Удалить при подключении реальной авторизации. */}
      {showOtp && phase !== "verified" && DEMO_MODE && bookingService.testOtpCode && (
        <Notice
          tone="neutral"
          icon="alert"
          title={`Демо-код: ${bookingService.testOtpCode}`}
          description="Демонстрационная сборка: смс не отправляется."
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

function otpState(phase: Phase): OtpState {
  if (phase === "invalid") return "error";
  if (phase === "verifying") return "verifying";
  if (phase === "verified") return "success";
  return "idle";
}
