import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  /** Подпись всегда видна — placeholder не заменяет label (Design System, Input). */
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}

/** Поле ввода Design v1: default, focus, error, disabled. */
export function Input({ label, hint, error, disabled, id, className, ...rest }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <label
        htmlFor={inputId}
        className={cn(
          "mb-2 text-[14px] font-semibold",
          disabled ? "text-(--color-text-disabled)" : "text-(--color-text-primary)",
        )}
      >
        {label}
        {rest.required && (
          <span aria-hidden="true" className="text-(--color-required-mark)">
            {" "}*
          </span>
        )}
      </label>
      <input
        {...rest}
        id={inputId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "h-12 w-full rounded-(--radius-m) border-[1.5px] px-4 text-[16px] outline-none",
          "bg-(--color-surface-card) text-(--color-text-primary)",
          "focus-visible:border-(--color-focus-ring) focus-visible:shadow-[0_0_0_3px_var(--color-focus-halo)]",
          error ? "border-(--color-border-error)" : "border-(--color-control-border)",
          "disabled:border-(--color-disabled-border) disabled:bg-(--color-disabled-bg) disabled:text-(--color-text-disabled)",
        )}
      />
      {error && (
        <p
          id={errorId}
          className="mt-1.5 flex items-center gap-1.5 text-[13px] leading-[18px] text-(--color-text-error)"
        >
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[13px] text-(--color-text-secondary)">
          {hint}
        </p>
      )}
    </div>
  );
}
