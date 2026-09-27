"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  /** Просьба закрыть: кнопка, Escape, нажатие на затемнение. Закрывает родитель — `open={false}`. */
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** Кнопки действий. Кнопка с `autoFocus` получает фокус при открытии. */
  children: ReactNode;
  /** Пока идёт действие — Escape и затемнение окно не закрывают. */
  busy?: boolean;
}

/**
 * Modal / Bottom Sheet (Design-System, Cabinet-Details-*): desktop — окно
 * по центру, mobile — нижний лист с «ручкой». В макете — статичный блок,
 * здесь — настоящий модальный диалог (handoff, раздел 6).
 *
 * Нативный <dialog> в модальном режиме: браузер сам удерживает фокус внутри
 * и делает фон недоступным. Открытием управляет только `open`: Escape
 * и затемнение лишь просят закрыть (onClose). После закрытия фокус
 * возвращается туда, откуда окно открыли, прокрутка страницы — разблокируется.
 */
export function Dialog({ open, onClose, title, description, children, busy = false }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Свежие onClose и busy для обработчика Escape, подписанного один раз.
  const onCloseRef = useRef(onClose);
  const busyRef = useRef(busy);
  useEffect(() => {
    onCloseRef.current = onClose;
    busyRef.current = busy;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // Escape: браузер не закрывает окно сам — решает родитель.
    const handleCancel = (event: Event) => {
      event.preventDefault();
      if (!busyRef.current) onCloseRef.current();
    };
    dialog.addEventListener("cancel", handleCancel);
    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      // Нажатие на затемнение приходится на сам <dialog>, а не на его содержимое.
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
      className={
        "m-0 max-h-none w-full max-w-none bg-transparent p-0 text-(--color-text-primary) backdrop:bg-(--color-backdrop) " +
        "max-md:mt-auto md:m-auto md:w-[440px]"
      }
    >
      <div className="w-full rounded-t-[20px] border border-(--color-border-decorative) bg-(--color-surface-card) px-[18px] pt-3.5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-(--shadow-l) md:rounded-(--radius-l) md:p-7">
        <div aria-hidden="true" className="mx-auto mb-3.5 h-1 w-9 rounded-sm bg-(--color-border-decorative) md:hidden" />
        <h2 id={titleId} className="text-[18px] font-bold text-(--color-text-primary) md:text-[19px]">
          {title}
        </h2>
        {description && (
          <div
            id={descriptionId}
            className="mt-2 text-[14px] leading-5 text-(--color-text-secondary) md:mt-4 md:text-[15px] md:leading-[22px]"
          >
            {description}
          </div>
        )}
        <div className="mt-4 flex flex-col-reverse gap-2.5 md:mt-5 md:flex-row md:justify-end md:gap-3">{children}</div>
      </div>
    </dialog>
  );
}
