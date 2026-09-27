import { selectImplementation } from "../config";
import { mockBookingService } from "./mock-booking-service";
import type { BookingService } from "./types";

/**
 * Расписание, резерв времени, создание и перенос записи.
 * Реализация выбирается переключателем DATA_SOURCE (services/config.ts).
 */
export const bookingService: BookingService = selectImplementation("bookingService", { mock: mockBookingService });

export type * from "./types";
