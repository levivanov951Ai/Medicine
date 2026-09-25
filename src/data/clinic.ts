import type { ClinicInfo } from "@/types/clinic";

/**
 * FACT — подтверждённые сведения о клинике (PROJECT_CONTEXT.md, раздел 2.1).
 * Это НЕ mock-данные. `null` — UNKNOWN: заказчик ещё не предоставил.
 *
 * `name` — display brand «СМЛаб» (PROJECT_CONTEXT.md, PD-22).
 * Официальное юридическое название организации — UNKNOWN, здесь не хранится.
 */
export const clinic: ClinicInfo = {
  name: "СМЛаб",
  address: "Западный обход, 42к2",
  phone: null,
  workingHours: null,
};
