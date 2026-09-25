/**
 * Сведения о клинике.
 * `null` означает UNKNOWN — данные заказчик ещё не предоставил.
 * Интерфейс сам решает, какой placeholder показать вместо них.
 */
export interface ClinicInfo {
  name: string;
  address: string;
  phone: string | null;
  workingHours: string | null;
}
