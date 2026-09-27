import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AccountGuard } from "@/components/features/account/AccountGuard";

export const metadata: Metadata = {
  robots: { index: false },
};

/**
 * Личный кабинет (PD-14): записи, запись, профиль.
 * Данные пациента живут в браузере (MOCK), поэтому содержимое рисуется на клиенте
 * после проверки входа; сервер отдаёт только справочники каталога.
 */
export default function AccountLayout({ children }: { children: ReactNode }) {
  return <AccountGuard>{children}</AccountGuard>;
}
