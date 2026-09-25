/**
 * Маршруты сайта. Структура — PROJECT_CONTEXT.md (PD-15)
 * и docs/DEVELOPER_HANDOFF.md, раздел 3.
 *
 * Параметры записи передают уже известный контекст, чтобы пользователь
 * не выбирал его повторно (PD-03): со страницы услуги мастер стартует
 * с шага «Врач», со страницы врача — с шага «Услуга».
 */
export const routes = {
  home: "/",
  services: "/services",
  doctors: "/doctors",
  lab: "/lab",
  labPackages: "/lab/packages",
  analysis: (id: string) => `/lab/${encodeURIComponent(id)}`,
  promo: "/promo",
  promotion: (id: string) => `/promo/${encodeURIComponent(id)}`,
  about: "/about",
  contacts: "/contacts",
  login: "/login",
  legal: (slug: string) => `/legal/${encodeURIComponent(slug)}`,

  booking: "/booking",
  bookingWithService: (serviceId: string) =>
    `/booking?service=${encodeURIComponent(serviceId)}`,
  bookingWithDoctor: (doctorId: string) =>
    `/booking?doctor=${encodeURIComponent(doctorId)}`,
  bookingLab: "/booking/lab",
} as const;
