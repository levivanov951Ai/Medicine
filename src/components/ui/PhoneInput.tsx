"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { formatPhoneDigits, normalizePhoneDigits } from "@/lib/phone";
import { Icon } from "./Icon";

interface PhoneInputProps {
  label: string;
  /** 10 цифр после «+7». */
  digits: string;
  onDigitsChange: (digits: string) => void;
  error?: string;
  /** Подсказка под полем — строка или разметка со ссылкой. */
  hint?: ReactNode;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
}

/**
 * Поле телефона (Booking-*, Cabinet-Login-*): «+7», разделитель и номер по маске.
 * Один компонент для записи и будущего входа (handoff, раздел 4).
 * На телефоне открывается цифровая клавиатура.
 */
export function PhoneInput({
  label,
  digits,
  onDigitsChange,
  error,
  hint,
  readOnly = false,
  required = false,
  id,
}: PhoneInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex w-full flex-col">
      <label htmlFor={inputId} className="mb-2 text-[14px] font-semibold text-(--color-text-primary)">
        {label}
        {required && (
          <span aria-hidden="true" className="text-(--color-required-mark)">
            {" "}*
          </span>
        )}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-(--radius-m) border-[1.5px] bg-(--color-surface-card) px-4 text-[16px] tabular-nums",
          "focus-within:border-(--color-focus-ring) focus-within:shadow-[0_0_0_3px_var(--color-focus-halo)]",
          error ? "border-(--color-border-error)" : "border-(--color-control-border)",
          readOnly && "bg-(--color-surface-page)",
        )}
      >
        <span aria-hidden="true" className="text-(--color-text-primary)">
          +7
        </span>
        <span aria-hidden="true" className="h-5 w-px bg-(--color-border-decorative)" />
        <input
          id={inputId}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(___) ___-__-__"
          required={required}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
          value={formatPhoneDigits(digits)}
          onChange={(event) => {
            const next = normalizePhoneDigits(event.target.value);
            // Стёрли символ маски («)», «-») — убираем и цифру перед ним.
            const deleted = event.target.value.length < formatPhoneDigits(digits).length;
            onDigitsChange(deleted && next === digits ? digits.slice(0, -1) : next);
          }}
          className="h-full min-w-0 flex-1 bg-transparent tracking-[.02em] text-(--color-text-primary) outline-none read-only:cursor-default"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 flex items-center gap-1.5 text-[13px] leading-[18px] text-(--color-text-error)">
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
      {hint && !error && (
        <div id={hintId} className="mt-1.5 text-[13px] leading-[18px] text-(--color-text-secondary)">
          {hint}
        </div>
      )}
    </div>
  );
}
