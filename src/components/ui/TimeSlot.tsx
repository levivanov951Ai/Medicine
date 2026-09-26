import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

const base =
  "inline-flex h-11 min-w-[84px] items-center justify-center gap-1.5 rounded-(--radius-m) border-[1.5px] px-3.5 text-[15px] tabular-nums";

const free =
  "cursor-pointer border-(--color-control-border) bg-(--color-surface-card) font-semibold text-(--color-text-primary) hover:bg-(--color-surface-hover)";

type TimeSlotProps =
  | {
      time: string;
      state: "free" | "selected" | "busy" | "pending";
      /** Для занятого слота не нужен — его нельзя выбрать. */
      onSelect?: () => void;
      /** Доступное имя без времени, например «24 сентября». */
      dateLabel: string;
    }
  | {
      time: string;
      state: "link";
      href: string;
      dateLabel: string;
    };

/**
 * Time Slot (Design System, 4 состояния): свободно, выбрано («Ваше время»),
 * занято и недоступно. Занятый слот — неактивная кнопка: её видно,
 * но выбрать нельзя. Вариант-ссылка — быстрые слоты на странице врача.
 */
export function TimeSlot(props: TimeSlotProps) {
  const { time, dateLabel } = props;

  if (props.state === "link") {
    return (
      <Link href={props.href} className={cn(base, free)} aria-label={`${dateLabel}, ${time} — записаться`}>
        {time}
      </Link>
    );
  }

  const { state, onSelect } = props;
  const busy = state === "busy";
  const selected = state === "selected";

  return (
    <button
      type="button"
      disabled={busy}
      aria-pressed={busy ? undefined : selected}
      aria-busy={state === "pending" || undefined}
      aria-label={`${time}${busy ? ", время занято" : ""}`}
      onClick={onSelect}
      className={cn(
        base,
        state === "free" && free,
        state === "pending" && cn(free, "opacity-70"),
        selected && "cursor-pointer border-(--color-cta-bg) bg-(--color-cta-bg) font-bold text-(--color-cta-text)",
        busy &&
          "border-(--color-border-decorative) bg-(--color-surface-page) font-semibold text-(--color-text-disabled) line-through",
      )}
    >
      {selected && <Icon name="check" size={15} />}
      {state === "pending" && <Icon name="spinner" size={15} className="motion-safe:animate-spin" />}
      {time}
    </button>
  );
}
