import type { Metadata } from "next";
import { BookingLabFlow } from "@/components/features/booking/BookingLabFlow";
import { getAnalysesCatalog } from "@/services/analyses";
import { getClinicInfo } from "@/services/clinic";

export const metadata: Metadata = {
  title: "Запись на анализы",
  description: "Онлайн-запись на сдачу анализов: дата и время визита в процедурный кабинет.",
  robots: { index: false },
};

/**
 * Запись на анализы. Сервер отдаёт каталог анализов — из него берутся
 * актуальные цены и подготовка для списка, выбранного в браузере.
 */
export default async function BookingLabPage() {
  const [{ items }, clinic] = await Promise.all([getAnalysesCatalog(), getClinicInfo()]);
  return <BookingLabFlow catalog={items} clinicAddress={clinic.address} />;
}
