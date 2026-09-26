import type { DayAvailability } from "./booking/types";
import type { Category, Doctor, DoctorWithSlot, Price, Service } from "@/types/catalog";
import { getDoctorQuickSlots, withNextSlots } from "./availability";
import { dataSource } from "./source";

export interface DoctorsCatalogData {
  /** Только направления, в которых есть врачи. */
  categories: Category[];
  doctors: DoctorWithSlot[];
}

/** Услуга врача и её стоимость у него. */
export interface DoctorServiceItem {
  service: Service;
  price: Price;
}

export interface DoctorPageData {
  doctor: DoctorWithSlot;
  /** Ближайшие дни со свободным временем — быстрые слоты. */
  quickSlots: DayAvailability[];
  /** Основное направление — для хлебных крошек. */
  category: Category | null;
  services: DoctorServiceItem[];
}

/** Все врачи без расписания — для записи, где ближайшее время считается в браузере. */
export async function getDoctors(): Promise<Doctor[]> {
  return dataSource.getDoctors();
}

/** Каталог «Врачи». Направления — общие с каталогом услуг. */
export async function getDoctorsCatalog(): Promise<DoctorsCatalogData> {
  const [categories, doctors] = await Promise.all([
    dataSource.getServiceCategories(),
    dataSource.getDoctors(),
  ]);
  return {
    categories: categories.filter((category) =>
      doctors.some((doctor) => doctor.categoryIds.includes(category.id)),
    ),
    doctors: await withNextSlots(doctors),
  };
}

/** Страница врача. `null` — врача нет (страница отвечает 404). */
export async function getDoctorPage(id: string): Promise<DoctorPageData | null> {
  const doctor = await dataSource.getDoctorById(id);
  if (!doctor) return null;

  const [categories, services] = await Promise.all([
    dataSource.getServiceCategories(),
    dataSource.getServices(),
  ]);

  const doctorServices = doctor.services.flatMap((offer) => {
    const service = services.find((item) => item.id === offer.serviceId);
    return service ? [{ service, price: offer.price }] : [];
  });

  const [withSlot] = await withNextSlots([doctor]);
  return {
    doctor: withSlot,
    quickSlots: await getDoctorQuickSlots(doctor.id),
    category: categories.find((category) => category.id === doctor.categoryIds[0]) ?? null,
    services: doctorServices,
  };
}
