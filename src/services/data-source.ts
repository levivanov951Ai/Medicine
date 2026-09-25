import type {
  Analysis,
  BookingPreview,
  Doctor,
  Promotion,
  QuickLink,
  Service,
} from "@/types/catalog";
import type { ClinicInfo } from "@/types/clinic";

/**
 * Контракт источника данных.
 *
 * Сейчас его реализует mock-source.ts. При подключении CRM появится
 * вторая реализация с тем же контрактом, а интерфейс сайта не изменится:
 *
 *   UI → services/* → DataSource → MOCK   (сейчас)
 *   UI → services/* → DataSource → CRM    (позже)
 *
 * Методы асинхронные уже сейчас — реальный источник будет сетевым.
 * Структура CRM здесь намеренно не моделируется.
 */
export interface DataSource {
  getClinicInfo(): Promise<ClinicInfo>;
  getServices(): Promise<Service[]>;
  getAnalyses(): Promise<Analysis[]>;
  getDoctors(): Promise<Doctor[]>;
  getPromotions(): Promise<Promotion[]>;
  getQuickLinks(): Promise<QuickLink[]>;
  getBookingPreview(): Promise<BookingPreview>;
}
