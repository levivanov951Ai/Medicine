"use client";

import { useCallback, useEffect, useState } from "react";
import { authSession, otpLength } from "@/lib/auth-session";
import type { Patient } from "@/types/patient";

/**
 * Этапы подтверждения номера — общие для входа (/login) и записи:
 * idle → sending → code → verifying → verified (или invalid → снова code).
 */
export type OtpPhase = "idle" | "sending" | "code" | "verifying" | "invalid" | "verified";

interface OtpFlowOptions {
  /** Номер уже подтверждён (вернулись к шагу записи по «Изменить»). */
  initiallyVerified?: boolean;
  /** Данные, которые сохраняются в профиль при входе (имя из формы записи). */
  details?: () => { name?: string };
  onVerified?: (patient: Patient) => void;
}

/**
 * Код подтверждения: отправка, повторная отправка с отсчётом, автопроверка
 * последней цифры. Проверка идёт через общий authSession — после успеха
 * пациент вошёл на всём сайте (шапка, кабинет, запись).
 */
export function useOtpFlow({ initiallyVerified = false, details, onVerified }: OtpFlowOptions = {}) {
  const [phase, setPhase] = useState<OtpPhase>(initiallyVerified ? "verified" : "idle");
  const [code, setCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [resendAt, setResendAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (phase !== "code" && phase !== "invalid") return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  const send = useCallback(async (phoneDigits: string) => {
    setPhase("sending");
    const { resendAfterSeconds } = await authSession.requestOtp(phoneDigits);
    setSentTo(phoneDigits);
    setCode("");
    setNow(Date.now());
    setResendAt(Date.now() + resendAfterSeconds * 1000);
    setPhase("code");
  }, []);

  const changeCode = async (value: string) => {
    setCode(value);
    if (phase === "invalid") setPhase("code");
    if (value.length < otpLength) return;
    setPhase("verifying");
    const result = await authSession.verifyOtp(sentTo, value, details?.());
    if (result.ok) {
      setPhase("verified");
      onVerified?.(result.patient);
    } else {
      setPhase("invalid");
    }
  };

  /** «Изменить номер» — назад к вводу телефона. */
  const reset = useCallback(() => {
    setPhase("idle");
    setCode("");
  }, []);

  return {
    phase,
    code,
    sentTo,
    secondsLeft: Math.max(0, Math.ceil((resendAt - now) / 1000)),
    /** Ячейки кода на экране (после «Изменить» с уже подтверждённым номером — не нужны). */
    inCodePhase: phase === "code" || phase === "verifying" || phase === "invalid" || phase === "verified",
    send,
    resend: () => send(sentTo),
    changeCode,
    reset,
  };
}

export type OtpFlow = ReturnType<typeof useOtpFlow>;
