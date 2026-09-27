import type { Metadata } from "next";
import { AppointmentDetails } from "@/components/features/account/AppointmentDetails";
import { getAppointmentReferences } from "@/services/account";

export const metadata: Metadata = { title: "Запись" };

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Детали записи. Запись ищется в браузере среди записей вошедшего пациента;
 * неизвестный или чужой id — «Запись не найдена» внутри кабинета.
 */
export default async function AppointmentPage({ params }: PageProps) {
  const [{ id }, references] = await Promise.all([params, getAppointmentReferences()]);
  return <AppointmentDetails id={id} references={references} />;
}
