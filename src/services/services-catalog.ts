import type { Category, DoctorWithSlot, Price, Service } from "@/types/catalog";
import { withNextSlots } from "./availability";
import { dataSource } from "./source";

/** Услуга с подписью направления — строка каталога, карточка главной. */
export interface ServiceListItem {
  service: Service;
  categoryLabel: string;
}

export interface ServicesCatalogData {
  /** Только направления, в которых есть услуги. */
  categories: Category[];
  items: ServiceListItem[];
}

/** Врач, который ведёт услугу, и его цена за неё. */
export interface ServiceDoctor {
  doctor: DoctorWithSlot;
  price: Price;
}

export interface ServicePageData {
  service: Service;
  category: Category | null;
  doctors: ServiceDoctor[];
  related: ServiceListItem[];
}

function toListItems(services: Service[], categories: Category[]): ServiceListItem[] {
  const labels = new Map(categories.map((category) => [category.id, category.label]));
  return services.map((service) => ({
    service,
    categoryLabel: labels.get(service.categoryId) ?? "",
  }));
}

/** Каталог «Услуги и цены»: порядок — по направлениям, внутри — как в источнике. */
export async function getServicesCatalog(): Promise<ServicesCatalogData> {
  const [categories, services] = await Promise.all([
    dataSource.getServiceCategories(),
    dataSource.getServices(),
  ]);
  const order = new Map(categories.map((category, index) => [category.id, index]));
  const sorted = [...services].sort(
    (a, b) => (order.get(a.categoryId) ?? Infinity) - (order.get(b.categoryId) ?? Infinity),
  );
  return {
    categories: categories.filter((category) => services.some((s) => s.categoryId === category.id)),
    items: toListItems(sorted, categories),
  };
}

/** «Популярные услуги» на главной — в заданном порядке, отсутствующие пропускаются. */
export async function getPopularServices(): Promise<ServiceListItem[]> {
  const [categories, services, popularIds] = await Promise.all([
    dataSource.getServiceCategories(),
    dataSource.getServices(),
    dataSource.getPopularServiceIds(),
  ]);
  const popular = popularIds
    .map((id) => services.find((service) => service.id === id))
    .filter((service): service is Service => service !== undefined);
  return toListItems(popular, categories);
}

/** Страница услуги. `null` — услуги нет (страница отвечает 404). */
export async function getServicePage(id: string): Promise<ServicePageData | null> {
  const service = await dataSource.getServiceById(id);
  if (!service) return null;

  const [categories, services, doctors] = await Promise.all([
    dataSource.getServiceCategories(),
    dataSource.getServices(),
    dataSource.getDoctors(),
  ]);

  const serviceDoctors = (await withNextSlots(doctors)).flatMap((doctor) => {
    const offer = doctor.services.find((item) => item.serviceId === service.id);
    return offer ? [{ doctor, price: offer.price }] : [];
  });

  const related = (service.relatedServiceIds ?? [])
    .map((relatedId) => services.find((item) => item.id === relatedId))
    .filter((item): item is Service => item !== undefined);

  return {
    service,
    category: categories.find((category) => category.id === service.categoryId) ?? null,
    doctors: serviceDoctors,
    related: toListItems(related, categories),
  };
}
