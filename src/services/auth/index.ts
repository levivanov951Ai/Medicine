import { selectImplementation } from "../config";
import { mockAuthService } from "./mock-auth-service";
import type { AuthService } from "./types";

/**
 * Вход по телефону и коду, сессия и профиль пациента.
 * Реализация выбирается переключателем DATA_SOURCE (services/config.ts).
 */
export const authService: AuthService = selectImplementation("authService", { mock: mockAuthService });

export type * from "./types";
