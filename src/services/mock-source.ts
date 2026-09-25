import { clinic } from "@/data/clinic";
import { mockAnalyses } from "@/data/mock/analyses";
import { mockBookingPreview } from "@/data/mock/booking-preview";
import { mockDoctors } from "@/data/mock/doctors";
import { mockPromotions } from "@/data/mock/promotions";
import { mockQuickLinks } from "@/data/mock/quick-links";
import { mockServices } from "@/data/mock/services";
import type { DataSource } from "./data-source";

/**
 * Реализация DataSource на MOCK-данных прототипа.
 * Единственный модуль, который импортирует src/data/mock.
 */
export const mockSource: DataSource = {
  getClinicInfo: async () => clinic,
  getServices: async () => mockServices,
  getAnalyses: async () => mockAnalyses,
  getDoctors: async () => mockDoctors,
  getPromotions: async () => mockPromotions,
  getQuickLinks: async () => mockQuickLinks,
  getBookingPreview: async () => mockBookingPreview,
};
