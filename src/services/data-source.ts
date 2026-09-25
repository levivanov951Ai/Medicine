import type {
  Analysis,
  BookingPreview,
  Category,
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
 * `get…ById` возвращают `null`, если сущности нет — страница отвечает 404.
 */
export interface DataSource {
  getClinicInfo(): Promise<ClinicInfo>;

  getServiceCategories(): Promise<Category[]>;
  getServices(): Promise<Service[]>;
  getServiceById(id: string): Promise<Service | null>;
  /** Услуги блока «Популярные услуги» на главной, в порядке показа. */
  getPopularServiceIds(): Promise<string[]>;

  getDoctors(): Promise<Doctor[]>;
  getDoctorById(id: string): Promise<Doctor | null>;

  getAnalysisCategories(): Promise<Category[]>;
  getAnalyses(): Promise<Analysis[]>;
  getAnalysisById(id: string): Promise<Analysis | null>;

  getPromotions(): Promise<Promotion[]>;
  getQuickLinks(): Promise<QuickLink[]>;
  getBookingPreview(): Promise<BookingPreview>;
}
