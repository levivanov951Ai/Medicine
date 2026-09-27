"use client";

import { useId } from "react";
import { Icon } from "@/components/ui/Icon";
import { OtpInput, type OtpState } from "@/components/ui/OtpInput";
import { Notice } from "@/components/ui/StateBlocks";
import { otpLength, testOtpCode } from "@/lib/auth-session";
import type { OtpFlow, OtpPhase } from "./use-otp-flow";

/** Демонстрационный режим (PD-26). По умолчанию выключен — тестовый код не показывается. */
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

interface OtpCodeFieldProps {
  flow: OtpFlow;
  /** Подсказка под ячейками — своя на каждом экране. */
  hint?: string;
}

/**
 * «Код из смс» (Booking-*, Cabinet-Login-*): ячейки кода, статус проверки,
 * отсчёт и повторная отправка, демо-код. Один компонент для входа и записи —
 * handoff, раздел 4: «в коде это один общий компонент, а не три копии».
 */
export function OtpCodeField({ flow, hint }: OtpCodeFieldProps) {
  const labelId = useId();
  const statusId = useId();
  const { phase, secondsLeft } = flow;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2.5">
        <p id={labelId} className="text-[14px] font-semibold text-(--color-text-primary)">
          Код из смс
        </p>
        <OtpInput
          length={otpLength}
          value={flow.code}
          onChange={flow.changeCode}
          state={otpState(phase)}
          labelId={labelId}
          describedBy={statusId}
          autoFocus
        />
        <div id={statusId} aria-live="polite">
          {flow.failure && phase === "code" && <OtpFailure message={flow.failure} />}
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
              onClick={flow.resend}
              className="touch-target inline-flex cursor-pointer items-center gap-1.5 rounded-(--radius-s) font-semibold text-(--color-text-link-strong) hover:underline"
            >
              Отправить ещё раз
              <Icon name="arrow-right" size={16} />
            </button>
          </p>
        ))}

      {hint && phase !== "verified" && (
        <p className="text-[13px] leading-[19px] text-(--color-text-secondary)">{hint}</p>
      )}

      {/* PD-26: демо-код виден только при NEXT_PUBLIC_DEMO_MODE=true. Удалить при подключении реальной авторизации. */}
      {DEMO_MODE && testOtpCode && phase !== "verified" && (
        <Notice
          tone="neutral"
          icon="alert"
          title={`Демо-код: ${testOtpCode}`}
          description="Демонстрационная сборка: смс не отправляется."
        />
      )}
    </div>
  );
}

/** Сбой отправки или проверки кода (нет сети, сервер не ответил). */
export function OtpFailure({ message }: { message: string }) {
  return (
    <p role="alert" className="flex items-start gap-1.5 text-[13px] leading-[18px] text-(--color-text-error)">
      <Icon name="alert" size={14} className="mt-0.5" />
      {message}
    </p>
  );
}

function otpState(phase: OtpPhase): OtpState {
  if (phase === "invalid") return "error";
  if (phase === "verifying") return "verifying";
  if (phase === "verified") return "success";
  return "idle";
}
