import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
/** sm 36 · md 44 · lg 52 — размеры из Design v1. */
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--radius-m) font-semibold leading-none " +
  "whitespace-nowrap transition-colors duration-150 cursor-pointer select-none disabled:cursor-not-allowed";

const sizes: Record<ButtonSize, string> = {
  // 36px визуально; область нажатия расширена до 44×44 (.touch-target)
  sm: "h-9 px-3.5 text-[14px] touch-target",
  md: "h-11 px-5 text-[16px]",
  lg: "h-[52px] px-6 text-[18px]",
};

/** Состояния взяты из Design-System.dc.html, раздел Button. */
const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-cta-bg) text-(--color-cta-text) " +
    "hover:bg-(--color-cta-bg-hover) active:bg-(--color-cta-bg-pressed)",
  secondary:
    "bg-(--color-surface-card) text-(--color-secondary-fg) border-[1.5px] border-(--color-secondary-border) " +
    "hover:bg-(--color-secondary-bg-hover) hover:text-(--color-secondary-fg-active) " +
    "active:bg-(--color-secondary-bg-pressed) active:text-(--color-secondary-fg-active) " +
    "active:border-(--color-secondary-border-pressed)",
  ghost:
    "bg-transparent text-(--color-secondary-fg) " +
    "hover:bg-(--color-ghost-bg-hover) hover:text-(--color-secondary-fg-active) " +
    "active:bg-(--color-ghost-bg-pressed) active:text-(--color-secondary-fg-active)",
  destructive:
    "bg-(--color-destructive-bg) text-(--color-text-on-fill) " +
    "hover:bg-(--color-destructive-bg-hover) active:bg-(--color-destructive-bg-pressed)",
};

const disabledStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-(--color-disabled-bg) text-(--color-text-disabled) border border-(--color-disabled-border)",
  secondary:
    "bg-(--color-surface-card) text-(--color-text-disabled) border-[1.5px] border-(--color-disabled-border)",
  ghost: "bg-transparent text-(--color-text-disabled)",
  destructive:
    "bg-(--color-disabled-bg) text-(--color-text-disabled) border border-(--color-disabled-border)",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

/** Навигация — рендерится ссылкой. */
export interface ButtonLinkProps extends CommonProps {
  href: string;
}

/** Действие на странице — рендерится <button>. */
export interface ButtonActionProps
  extends CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  loading?: boolean;
}

export type ButtonProps = ButtonLinkProps | ButtonActionProps;

function isLink(props: ButtonProps): props is ButtonLinkProps {
  return "href" in props && typeof props.href === "string";
}

/**
 * Кнопка Design v1.
 * С `href` — ссылка (переход на страницу), без него — <button> (действие).
 */
export function Button(props: ButtonProps) {
  if (isLink(props)) {
    const { variant = "primary", size = "md", fullWidth, className, children, href } = props;
    return (
      <Link
        href={href}
        className={cn(base, sizes[size], variants[variant], fullWidth && "w-full", className)}
      >
        {children}
      </Link>
    );
  }

  const {
    variant = "primary",
    size = "md",
    fullWidth,
    className,
    children,
    loading = false,
    disabled = false,
    type = "button",
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        base,
        sizes[size],
        disabled ? disabledStyles[variant] : variants[variant],
        loading && "opacity-85",
        fullWidth && "w-full",
        className,
      )}
    >
      {loading && <Icon name="spinner" size={18} className="motion-safe:animate-spin" />}
      <span>{children}</span>
    </button>
  );
}
