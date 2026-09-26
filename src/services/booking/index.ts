import { mockBookingService } from "./mock-booking-service";
import type { BookingService } from "./types";

/**
 * Единственная точка выбора реализации записи.
 * При подключении CRM здесь меняется одна строка.
 */
export const bookingService: BookingService = mockBookingService;

export type * from "./types";
