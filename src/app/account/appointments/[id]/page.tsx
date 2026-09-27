import type { Metadata } from "next";
import { AppointmentDetails } from "@/components/features/account/AppointmentDetails";
import { getAppointmentReferences } from "@/services/account";

export const metadata: Metadata = { title: "Запись" };

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ updated?: string | string[] }>;
}

/**
 * Детали записи. Запись ищется в браузере среди записей вошедшего пациента;
 * неизвестный или чужой id — «Запись не найдена» внутри кабинета.
 * `?updated=rescheduled` — сюда возвращает подтверждённый перенос.
 */
export default async function AppointmentPage({ params, searchParams }: PageProps) {
  const [{ id }, { updated }, references] = await Promise.all([params, searchParams, getAppointmentReferences()]);
  return (
    <AppointmentDetails id={id} references={references} initialUpdate={updated === "rescheduled" ? "rescheduled" : null} />
  );
}
