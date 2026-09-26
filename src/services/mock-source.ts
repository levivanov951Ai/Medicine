import { clinic } from "@/data/clinic";
import { mockAnalyses } from "@/data/mock/analyses";
import { mockAnalysisCategories, mockServiceCategories } from "@/data/mock/categories";
import { mockDoctors } from "@/data/mock/doctors";
import { mockPromotions } from "@/data/mock/promotions";
import { mockQuickLinks } from "@/data/mock/quick-links";
import { mockPopularServiceIds, mockServices } from "@/data/mock/services";
import type { DataSource } from "./data-source";

const byId = <T extends { id: string }>(items: T[], id: string): T | null =>
  items.find((item) => item.id === id) ?? null;

/**
 * Реализация DataSource на MOCK-данных прототипа.
 * Единственный модуль, который импортирует src/data/mock.
 */
export const mockSource: DataSource = {
  getClinicInfo: async () => clinic,

  getServiceCategories: async () => mockServiceCategories,
  getServices: async () => mockServices,
  getServiceById: async (id) => byId(mockServices, id),
  getPopularServiceIds: async () => mockPopularServiceIds,

  getDoctors: async () => mockDoctors,
  getDoctorById: async (id) => byId(mockDoctors, id),

  getAnalysisCategories: async () => mockAnalysisCategories,
  getAnalyses: async () => mockAnalyses,
  getAnalysisById: async (id) => byId(mockAnalyses, id),

  getPromotions: async () => mockPromotions,
  getQuickLinks: async () => mockQuickLinks,
};
