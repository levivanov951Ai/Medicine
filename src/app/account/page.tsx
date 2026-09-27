import type { Metadata } from "next";
import { AppointmentsDashboard } from "@/components/features/account/AppointmentsDashboard";
import { getAppointmentReferences } from "@/services/account";

export const metadata: Metadata = { title: "Личный кабинет" };

/**
 * «Мои записи» (PD-14): ближайшая, будущие, прошедшие и отменённые записи.
 * Записи пациента читаются в браузере; сервер отдаёт справочник каталога для подписей.
 */
export default async function AccountPage() {
  return <AppointmentsDashboard references={await getAppointmentReferences()} />;
}
