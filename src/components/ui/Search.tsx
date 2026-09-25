"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

/** responsive — 48px на mobile, 56px с 768px (первый экран главной, шапки каталогов). */
type SearchSize = "md" | "lg" | "responsive";

interface SearchProps {
  /** Страница, на которую отправляется запрос (GET, параметр `q`). */
  action: string;
  placeholder: string;
  /** Доступное имя поля. Видимой подписи в Design v1 у поиска нет. */
  label: string;
  size?: SearchSize;
  defaultValue?: string;
  /**
   * Управляемый режим (каталоги): список фильтруется по мере ввода,
   * форма не перезагружает страницу. Без JavaScript форма по-прежнему
   * отправляется обычным GET-запросом.
   */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Дополнительные параметры формы — например, выбранное направление. */
  hiddenFields?: Record<string, string | undefined>;
  className?: string;
}

const heights: Record<SearchSize, string> = {
  md: "h-12 text-[16px]",
  lg: "h-14 text-[17px]",
  responsive: "h-12 text-[16px] md:h-14 md:text-[17px]",
};

/**
 * Поле поиска Design v1. Отправляется по Enter обычной формой —
 * работает и без JavaScript.
 */
export function Search({
  action,
  placeholder,
  label,
  size = "md",
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  hiddenFields,
  className,
}: SearchProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [ownValue, setOwnValue] = useState(defaultValue);
  const isControlled = onValueChange !== undefined;
  const value = isControlled ? (controlledValue ?? "") : ownValue;

  const setValue = (next: string) => {
    if (isControlled) onValueChange(next);
    else setOwnValue(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    // Результаты уже на экране — перезагрузка не нужна; прячем клавиатуру на mobile.
    if (isControlled) {
      event.preventDefault();
      inputRef.current?.blur();
    }
  };

  return (
    <form role="search" action={action} method="get" onSubmit={handleSubmit} className={cn("w-full", className)}>
      {hiddenFields &&
        Object.entries(hiddenFields).map(([name, fieldValue]) =>
          fieldValue ? <input key={name} type="hidden" name={name} value={fieldValue} /> : null,
        )}
      <div
        className={cn(
          "flex w-full items-center gap-2.5 rounded-[14px] border-[1.5px] px-[18px]",
          "border-(--color-control-border) bg-(--color-surface-card)",
          "focus-within:border-(--color-focus-ring) focus-within:shadow-[0_0_0_3px_var(--color-focus-halo)]",
          heights[size],
        )}
      >
        <span className="flex text-(--color-icon-accent)">
          <Icon name="search" size={20} />
        </span>
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          ref={inputRef}
          id={inputId}
          type="search"
          name="q"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 bg-transparent text-(--color-text-primary) outline-none [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <button
            type="button"
            aria-label="Очистить поиск"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            className="touch-target flex rounded-(--radius-s) p-1 text-(--color-icon-muted) hover:text-(--color-text-secondary)"
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </div>
    </form>
  );
}
