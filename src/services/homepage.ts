import type { Analysis, BookingPreview, Doctor, Promotion, QuickLink } from "@/types/catalog";
import type { ClinicInfo } from "@/types/clinic";
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
  featuredDoctors: Doctor[];
  promotions: Promotion[];
  bookingPreview: BookingPreview;
}

/** Все данные главной одним запросом — источники опрашиваются параллельно. */
export async function getHomepageData(): Promise<HomepageData> {
  const [clinic, quickLinks, popularServices, analyses, doctors, promotions, bookingPreview] =
    await Promise.all([
      dataSource.getClinicInfo(),
      dataSource.getQuickLinks(),
      getPopularServices(),
      dataSource.getAnalyses(),
      dataSource.getDoctors(),
      dataSource.getPromotions(),
      dataSource.getBookingPreview(),
    ]);

  return {
    clinic,
    quickLinks,
    popularServices: popularServices.slice(0, HOMEPAGE_LIMITS.services),
    featuredAnalyses: analyses.slice(0, HOMEPAGE_LIMITS.analyses),
    featuredDoctors: doctors.slice(0, HOMEPAGE_LIMITS.doctors),
    promotions,
    bookingPreview,
  };
}
