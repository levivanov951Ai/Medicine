/**
 * Маршруты сайта. Структура — PROJECT_CONTEXT.md (PD-15)
 * и docs/DEVELOPER_HANDOFF.md, раздел 3.
 *
 * Параметры записи передают уже известный контекст, чтобы пользователь
 * не выбирал его повторно (PD-03): со страницы услуги мастер стартует
 * с шага «Врач», со страницы врача — с шага «Услуга», с услуги в профиле
 * врача — сразу с шага «Дата и время».
 */

/** Ссылка на каталог с фильтрами. Пустые параметры в адрес не попадают. */
function catalogHref(path: string, params: { q?: string; category?: string }): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}

export const routes = {
  home: "/",
  services: "/services",
  servicesCatalog: (params: { q?: string; category?: string }) => catalogHref("/services", params),
  service: (id: string) => `/services/${encodeURIComponent(id)}`,
  doctors: "/doctors",
  doctorsCatalog: (params: { q?: string; category?: string }) => catalogHref("/doctors", params),
  doctor: (id: string) => `/doctors/${encodeURIComponent(id)}`,
  lab: "/lab",
  labCatalog: (params: { q?: string; category?: string }) => catalogHref("/lab", params),
  labPackages: "/lab/packages",
  /** Программа на странице комплексов — отдельной страницы программы нет. */
  labPackage: (id: string) => `/lab/packages#${encodeURIComponent(id)}`,
  labSelected: "/lab/selected",
  analysis: (id: string) => `/lab/${encodeURIComponent(id)}`,
  promo: "/promo",
  about: "/about",
  contacts: "/contacts",
  login: "/login",
  /** Вход с возвратом туда, куда пациент шёл (только внутренние адреса — см. safeReturnPath). */
  loginWithReturn: (next: string) => `/login?next=${encodeURIComponent(next)}`,
  legal: (slug: string) => `/legal/${encodeURIComponent(slug)}`,

  booking: "/booking",
  bookingWithService: (serviceId: string) => bookingHref({ service: serviceId }),
  bookingWithDoctor: (doctorId: string) => bookingHref({ doctor: doctorId }),
  bookingWithServiceAndDoctor: (serviceId: string, doctorId: string) =>
    bookingHref({ service: serviceId, doctor: doctorId }),
  /** Быстрый слот со страницы врача: врач и время известны, услуга — если выбрана. */
  bookingWithSlot: (doctorId: string, date: string, time: string, serviceId?: string) =>
    bookingHref({ service: serviceId, doctor: doctorId, date, time }),
  /** Выбранные анализы берутся из сохранённого выбора, в адрес не передаются. */
  bookingLab: "/booking/lab",
  /** Личный кабинет (PD-14): записи, детали записи, профиль. */
  account: "/account",
  accountProfile: "/account/profile",
  appointment: (id: string) => `/account/appointments/${encodeURIComponent(id)}`,
  rescheduleAppointment: (id: string) => `/account/appointments/${encodeURIComponent(id)}/reschedule`,
} as const;

function bookingHref(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
  return `/booking?${search.toString()}`;
}

/**
 * Адрес возврата после входа (?next=). Принимается только путь внутри сайта:
 * «/account/…», но не «//evil.example» и не «https://…» — иначе ссылка
 * на вход могла бы увести пациента на чужой сайт.
 */
export function safeReturnPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null;
  if (value === "/login" || value.startsWith("/login?")) return null;
  return value;
}
