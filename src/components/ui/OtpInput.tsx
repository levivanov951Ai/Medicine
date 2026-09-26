"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

export type OtpState = "idle" | "error" | "verifying" | "success";

interface OtpInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;
  state: OtpState;
  /** id подписи группы («Код из смс»). */
  labelId: string;
  /** id сообщения об ошибке или статусе. */
  describedBy?: string;
  autoFocus?: boolean;
}

/**
 * Ячейки кода подтверждения (Booking-*, Cabinet-Login-*): ввод, ошибка,
 * проверка, успех. Один компонент для записи и будущего входа.
 * Цифры вводятся по одной с автопереходом; вставка кода целиком
 * и автоподстановка из смс (autocomplete="one-time-code") тоже работают.
 */
export function OtpInput({ length, value, onChange, state, labelId, describedBy, autoFocus }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");
  const locked = state === "verifying" || state === "success";

  const focusCell = (index: number) => refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const setFrom = (index: number, input: string) => {
    const clean = input.replace(/\D/g, "");
    if (!clean) return;
    const next = (value.slice(0, index) + clean).slice(0, length);
    onChange(next);
    focusCell(next.length);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index]) onChange(value.slice(0, index) + value.slice(index + 1));
      else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusCell(index - 1);
      }
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusCell(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusCell(index + 1);
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    setFrom(index, event.clipboardData.getData("text"));
  };

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy} className="flex gap-2 md:gap-2.5">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          aria-label={`Цифра ${index + 1} из ${length}`}
          aria-invalid={state === "error" ? true : undefined}
          readOnly={locked}
          autoFocus={autoFocus && index === 0}
          value={digit}
          onChange={(event) => setFrom(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(event, index)}
          onPaste={(event) => onPaste(event, index)}
          onFocus={(event) => event.target.select()}
          className={cn(
            "h-[52px] w-11 rounded-(--radius-m) border-[1.5px] bg-(--color-surface-card) text-center text-[20px] font-semibold text-(--color-text-primary) tabular-nums outline-none md:h-14 md:w-12",
            "focus:border-(--color-focus-ring) focus:shadow-[0_0_0_3px_var(--color-focus-halo)]",
            state === "idle" && "border-(--color-control-border)",
            state === "error" && "border-(--color-border-error)",
            state === "verifying" && "border-(--color-border-decorative) bg-(--color-surface-page)",
            state === "success" && "border-(--color-icon-success)",
          )}
        />
      ))}
    </div>
  );
}
