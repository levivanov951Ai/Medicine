import type { Category, Doctor, Price, Service } from "@/types/catalog";
import { dataSource } from "./source";

export interface DoctorsCatalogData {
  /** Только направления, в которых есть врачи. */
  categories: Category[];
  doctors: Doctor[];
}

/** Услуга врача и её стоимость у него. */
export interface DoctorServiceItem {
  service: Service;
  price: Price;
}

export interface DoctorPageData {
  doctor: Doctor;
  /** Основное направление — для хлебных крошек. */
  category: Category | null;
  services: DoctorServiceItem[];
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
    doctors,
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

  return {
    doctor,
    category: categories.find((category) => category.id === doctor.categoryIds[0]) ?? null,
    services: doctorServices,
  };
}
