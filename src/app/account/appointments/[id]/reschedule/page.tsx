import type { Metadata } from "next";
import { RescheduleFlow } from "@/components/features/account/RescheduleFlow";
import { getAppointmentReferences } from "@/services/account";

export const metadata: Metadata = { title: "Перенос записи" };

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Перенос записи (PD-06): только новые дата и время. */
export default async function ReschedulePage({ params }: PageProps) {
  const [{ id }, references] = await Promise.all([params, getAppointmentReferences()]);
  return <RescheduleFlow id={id} references={references} />;
}
