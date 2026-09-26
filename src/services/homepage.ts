import type { Analysis, BookingPreview, DoctorWithSlot, Promotion, QuickLink } from "@/types/catalog";
import type { ClinicInfo } from "@/types/clinic";
import { getBookingPreview, withNextSlots } from "./availability";
import { getPopularServices, type ServiceListItem } from "./services-catalog";
import { dataSource } from "./source";

/** Сколько элементов показывает главная на desktop (Design v1). */
export const HOMEPAGE_LIMITS = {
  services: 8,
  analyses: 4,
  doctors: 5,
} as const;

export interface HomepageData {
  clinic: ClinicInfo;
  quickLinks: QuickLink[];
  popularServices: ServiceListItem[];
  featuredAnalyses: Analysis[];
  featuredDoctors: DoctorWithSlot[];
  promotions: Promotion[];
  /** null — у врача нет свободного времени, превью не показывается. */
  bookingPreview: BookingPreview | null;
}

/** Все данные главной одним запросом — источники опрашиваются параллельно. */
export async function getHomepageData(): Promise<HomepageData> {
  const [clinic, quickLinks, popularServices, analyses, doctors, promotions] =
    await Promise.all([
      dataSource.getClinicInfo(),
      dataSource.getQuickLinks(),
      getPopularServices(),
      dataSource.getAnalyses(),
      dataSource.getDoctors(),
      dataSource.getPromotions(),
    ]);
  const featuredDoctors = doctors.slice(0, HOMEPAGE_LIMITS.doctors);

  return {
    clinic,
    quickLinks,
    popularServices: popularServices.slice(0, HOMEPAGE_LIMITS.services),
    featuredAnalyses: analyses.slice(0, HOMEPAGE_LIMITS.analyses),
    featuredDoctors: await withNextSlots(featuredDoctors),
    promotions,
    bookingPreview: featuredDoctors[0] ? await getBookingPreview(featuredDoctors[0]) : null,
  };
}
