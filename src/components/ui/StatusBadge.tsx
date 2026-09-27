import type { AppointmentStatus } from "@/types/appointment";
import type { IconName } from "@/types/icon";
import { Badge, type BadgeTone } from "./Badge";

const statuses: Record<AppointmentStatus, { label: string; tone: BadgeTone; icon: IconName }> = {
  // blue-700 на blue-100 — 6.09
  upcoming: { label: "Предстоящая", tone: "info", icon: "clock" },
  // success-text на #E4F5EC — 4.72
  completed: { label: "Завершена", tone: "success", icon: "check" },
  // ink-600 на surface — 6.76
  cancelled: { label: "Отменена", tone: "category", icon: "close" },
};

/**
 * Статус записи (Design System, Status Badge; PD-06): предстоящая, завершена, отменена.
 * Смысл передаёт текст — цвет и иконка его только дублируют.
 */
export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, tone, icon } = statuses[status];
  return (
    <Badge tone={tone} icon={icon}>
      {label}
    </Badge>
  );
}
