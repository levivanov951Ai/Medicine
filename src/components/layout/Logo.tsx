import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

interface LogoProps {
  name: string;
  /** md — 40px (desktop, подвал), sm — 34px (мобильная шапка). */
  size?: "md" | "sm";
  /** inverse — белое название на тёмном фоне подвала. */
  tone?: "default" | "inverse";
  onNavigate?: () => void;
}

/** Логотип: векторный знак из Design v1 + название. Ведёт на главную. */
export function Logo({ name, size = "md", tone = "default", onNavigate }: LogoProps) {
  const isSmall = size === "sm";

  return (
    <Link
      href={routes.home}
      onClick={onNavigate}
      aria-label={`${name} — на главную`}
      className={cn("inline-flex shrink-0 items-center rounded-(--radius-s)", isSmall ? "gap-2.5" : "gap-[11px]")}
    >
      <Image
        src="/brand/smlab-mark.svg"
        alt=""
        width={isSmall ? 30 : 35}
        height={isSmall ? 34 : 40}
        unoptimized
        priority={tone === "default"}
      />
      <span
        className={cn(
          "leading-none font-bold tracking-[-0.01em] whitespace-nowrap",
          isSmall ? "text-[21px]" : "text-[25px]",
          tone === "inverse" ? "text-(--color-text-on-inverse)" : "text-(--color-text-primary)",
        )}
      >
        {name}
      </span>
    </Link>
  );
}
