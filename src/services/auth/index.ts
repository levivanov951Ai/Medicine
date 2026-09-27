import { mockAuthService } from "./mock-auth-service";
import type { AuthService } from "./types";

/**
 * Единственная точка выбора реализации авторизации.
 * При подключении настоящего OTP-провайдера / CRM здесь меняется одна строка.
 */
export const authService: AuthService = mockAuthService;

export type * from "./types";
