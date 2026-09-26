import type { Metadata } from "next";
import { BookingDoctorFlow } from "@/components/features/booking/BookingDoctorFlow";
import { getClinicInfo } from "@/services/clinic";
import { getDoctors } from "@/services/doctors";
import { getServicesCatalog } from "@/services/services-catalog";

export const metadata: Metadata = {
  title: "Запись к врачу",
  description: "Онлайн-запись к врачу: услуга, врач, дата и время. Запись подтверждается сразу.",
  robots: { index: false },
};

/**
 * Запись к врачу. Сервер отдаёт каталог (услуги, направления, врачи),
 * весь мастер работает в браузере: выбранное хранится в черновике вкладки.
 * Параметры адреса (?service, ?doctor, ?date, ?time) читает и проверяет мастер.
 */
export default async function BookingPage() {
  const [{ categories, items }, doctors, clinic] = await Promise.all([
    getServicesCatalog(),
    getDoctors(),
    getClinicInfo(),
  ]);

  return (
    <BookingDoctorFlow
      services={items.map(({ service, categoryLabel }) => ({
        id: service.id,
        title: service.title,
        categoryId: service.categoryId,
        categoryLabel,
        price: service.price,
      }))}
      categories={categories}
      doctors={doctors}
      clinicAddress={clinic.address}
    />
  );
}
