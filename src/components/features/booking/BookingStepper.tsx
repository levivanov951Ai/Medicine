import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

export type StepState = "done" | "current" | "upcoming";

export interface StepperStep {
  label: string;
  state: StepState;
}

interface BookingStepperProps {
  steps: StepperStep[];
  /** «Назад» — предыдущий шаг или выход из записи. */
  onBack: () => void;
}

/**
 * Booking Stepper (Booking-*.dc.html).
 * Desktop: «Назад» и шаги в строку — пройденные с галочкой, текущий выделен.
 * Mobile: «Назад», «Шаг N из M», название шага и полоски прогресса.
 * Шаги, известные до входа в запись, приходят уже пройденными.
 */
export function BookingStepper({ steps, onBack }: BookingStepperProps) {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.state === "current"),
  );
  const current = steps[currentIndex];

  return (
    <div className="border-b border-(--color-border-decorative) bg-(--color-surface-card)">
      <Container className="pt-3 pb-3.5 lg:flex lg:items-center lg:gap-9 lg:py-4">
        <div className="flex items-center justify-between lg:shrink-0">
          <button
            type="button"
            onClick={onBack}
            className="touch-target inline-flex cursor-pointer items-center gap-1.5 rounded-(--radius-s) text-[14px] font-semibold whitespace-nowrap text-(--color-text-link-strong) hover:underline"
          >
            <Icon name="chevron-left" size={16} />
            Назад
          </button>
          <span className="text-[13px] text-(--color-text-secondary) lg:hidden">
            Шаг {currentIndex + 1} из {steps.length}
          </span>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <p className="mt-2 text-[16px] font-bold text-(--color-text-primary)">{current?.label}</p>
          <div aria-hidden="true" className="mt-2.5 flex gap-1">
            {steps.map((step) => (
              <span
                key={step.label}
                className={cn(
                  "h-1 flex-1 rounded-sm",
                  step.state === "upcoming" ? "bg-(--color-border-decorative)" : "bg-(--color-step-current-bg)",
                )}
              />
            ))}
          </div>
        </div>

        {/* Desktop */}
        <ol aria-label="Шаги записи" className="hidden items-center gap-3 lg:flex">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3">
              {index > 0 && <span aria-hidden="true" className="h-[1.5px] w-7 bg-(--color-border-decorative)" />}
              <span aria-current={step.state === "current" ? "step" : undefined} className="flex items-center gap-2">
                <StepMarker state={step.state} number={index + 1} />
                <span
                  className={cn(
                    "text-[14px] whitespace-nowrap",
                    step.state === "current" && "font-bold text-(--color-text-primary)",
                    step.state === "done" && "font-semibold text-(--color-text-secondary)",
                    step.state === "upcoming" && "font-semibold text-(--color-step-upcoming-fg)",
                  )}
                >
                  {step.label}
                  {step.state === "done" && <span className="sr-only"> — готово</span>}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}

function StepMarker({ state, number }: { state: StepState; number: number }) {
  const base = "flex size-[26px] shrink-0 items-center justify-center rounded-(--radius-pill) text-[13px] font-bold";
  if (state === "done") {
    return (
      <span aria-hidden="true" className={cn(base, "bg-(--color-step-done-bg) text-(--color-step-done-fg)")}>
        <Icon name="check" size={14} />
      </span>
    );
  }
  if (state === "current") {
    return (
      <span aria-hidden="true" className={cn(base, "bg-(--color-step-current-bg) text-(--color-text-on-fill)")}>
        {number}
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        base,
        "border-[1.5px] border-(--color-border-decorative) bg-(--color-surface-card) text-(--color-step-upcoming-fg)",
      )}
    >
      {number}
    </span>
  );
}
