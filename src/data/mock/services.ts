/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются сведениями клиники: список услуг, цены и описания — UNKNOWN.
 * Тексты описаний демонстрационные — это не медицинские рекомендации.
 *
 * КАНОНИЧЕСКИЙ набор MOCK-услуг: главная, каталог «Услуги и цены»,
 * страницы услуг и страницы врачей берут услуги только отсюда.
 * Источники: Homepage-Desktop («Популярные услуги»), Catalog-*, Service-*.dc.html.
 * Вся папка src/data/mock удаляется при подключении CRM.
 */
import type { Service } from "@/types/catalog";

export const mockServices: Service[] = [
  // — Терапия —
  {
    id: "therapist-primary",
    title: "Приём терапевта первичный",
    categoryId: "therapy",
    price: { amount: 2400 },
    summary:
      "Осмотр терапевта, сбор жалоб и анамнеза, измерение давления, направление на обследования при необходимости.",
    description:
      "Терапевт оценивает общее состояние, разбирает жалобы и уже имеющиеся обследования и, если нужно, направляет к профильному специалисту или на анализы.",
    steps: [
      "Регистратор встречает вас и провожает в кабинет",
      "Врач собирает жалобы и историю заболеваний",
      "Измеряются давление и пульс, проводится осмотр",
      "Врач даёт рекомендации и, если нужно, направления",
    ],
    preparation: "Специальная подготовка не требуется. Возьмите с собой результаты предыдущих обследований, если они есть.",
    relatedServiceIds: ["therapist-repeat", "preventive-exam", "ecg"],
  },
  {
    id: "therapist-repeat",
    title: "Приём терапевта повторный",
    categoryId: "therapy",
    price: { amount: 1900 },
    summary: "Повторная консультация терапевта по результатам обследований и лечения.",
    relatedServiceIds: ["therapist-primary"],
  },
  {
    id: "preventive-exam",
    title: "Профилактический осмотр взрослого пациента",
    categoryId: "therapy",
    price: { amount: 2100 },
    summary: "Плановый осмотр терапевта без конкретных жалоб.",
    relatedServiceIds: ["therapist-primary"],
  },
  {
    id: "complex-consultation",
    title: "Комплексная консультация по результатам анализов и УЗИ органов брюшной полости",
    categoryId: "therapy",
    price: { amount: 2800, isFrom: true },
    summary: "Разбор результатов анализов и УЗИ на одном приёме.",
    relatedServiceIds: ["abdominal-ultrasound", "therapist-primary"],
  },
  {
    id: "pool-certificate",
    title: "Оформление справки для бассейна",
    categoryId: "therapy",
    price: { amount: 1200 },
    summary: "Осмотр и оформление справки для посещения бассейна.",
  },
  {
    id: "sick-leave",
    title: "Оформление больничного листа",
    categoryId: "therapy",
    price: { amount: 1000 },
    summary: "Оформление листка нетрудоспособности по результатам приёма.",
  },

  // — Кардиология —
  {
    id: "cardiologist",
    title: "Приём кардиолога",
    categoryId: "cardiology",
    price: { amount: 3100, oldAmount: 3800 },
    summary:
      "Осмотр кардиолога, сбор жалоб и анамнеза, измерение давления и пульса, интерпретация уже имеющихся обследований, назначение дальнейшего плана при необходимости.",
    description:
      "Приём включает осмотр врача-кардиолога, оценку жалоб и истории заболеваний, измерение артериального давления и частоты пульса. При необходимости врач направит на дополнительные исследования — ЭКГ, УЗИ сердца или лабораторные анализы.",
    indications: [
      "Повышенное или пониженное давление",
      "Учащённое или неровное сердцебиение",
      "Одышка при обычной нагрузке",
      "Плановое наблюдение при хронических заболеваниях сердца",
    ],
    steps: [
      "Регистратор встречает вас и провожает в кабинет",
      "Врач собирает жалобы и историю заболеваний",
      "Измеряются давление и пульс, проводится осмотр",
      "Врач даёт рекомендации и, если нужно, направления",
    ],
    preparation:
      "Специальная подготовка не требуется. Возьмите с собой результаты предыдущих обследований сердца, если они есть.",
    relatedServiceIds: ["ecg", "echocardiography", "bp-monitoring"],
  },
  {
    id: "cardiologist-repeat",
    title: "Приём кардиолога повторный",
    categoryId: "cardiology",
    price: { amount: 2300, isFrom: true },
    summary: "Повторная консультация кардиолога по результатам обследований.",
    relatedServiceIds: ["cardiologist"],
  },
  {
    id: "ecg",
    title: "ЭКГ с расшифровкой",
    categoryId: "cardiology",
    price: { amount: 1400, isFrom: true },
    summary: "Запись электрокардиограммы и расшифровка врачом.",
    preparation: "Специальная подготовка не требуется.",
    relatedServiceIds: ["cardiologist", "holter"],
  },
  {
    id: "echocardiography",
    title: "УЗИ сердца (ЭхоКГ)",
    categoryId: "cardiology",
    price: { amount: 3200, isFrom: true },
    summary: "Ультразвуковое исследование сердца и клапанов.",
    relatedServiceIds: ["cardiologist", "ecg"],
  },
  {
    id: "bp-monitoring",
    title: "Суточный мониторинг давления",
    categoryId: "cardiology",
    price: { amount: 2900 },
    summary: "Запись артериального давления в течение суток в обычном режиме дня.",
    relatedServiceIds: ["cardiologist", "holter"],
  },
  {
    id: "holter",
    title: "Холтеровское мониторирование ЭКГ",
    categoryId: "cardiology",
    price: { amount: 3300 },
    summary: "Запись ЭКГ в течение суток портативным прибором.",
    relatedServiceIds: ["ecg", "bp-monitoring"],
  },

  // — Педиатрия —
  {
    id: "pediatrician",
    title: "Приём педиатра",
    categoryId: "pediatrics",
    price: { amount: 2200 },
    summary: "Осмотр ребёнка, оценка развития, рекомендации и направления при необходимости.",
    relatedServiceIds: ["pediatric-cardiologist", "child-certificate"],
  },
  {
    id: "pediatric-cardiologist",
    title: "Приём детского кардиолога",
    categoryId: "pediatrics",
    price: { amount: 2700 },
    summary: "Консультация кардиолога для детей.",
    relatedServiceIds: ["pediatrician", "ecg"],
  },
  {
    id: "child-certificate",
    title: "Справка в детский сад или школу",
    categoryId: "pediatrics",
    price: { amount: 900 },
    summary: "Осмотр педиатра и оформление справки.",
  },

  // — Гинекология —
  {
    id: "gynecologist-exam",
    title: "Гинекологический осмотр",
    categoryId: "gynecology",
    price: { amount: 2600 },
    summary: "Консультация и осмотр гинеколога.",
    relatedServiceIds: ["gynecologist-repeat", "pelvic-ultrasound"],
  },
  {
    id: "gynecologist-repeat",
    title: "Приём гинеколога повторный",
    categoryId: "gynecology",
    price: { amount: 2100 },
    summary: "Повторная консультация по результатам обследований.",
    relatedServiceIds: ["gynecologist-exam"],
  },

  // — Эндокринология —
  {
    id: "endocrinologist",
    title: "Приём эндокринолога",
    categoryId: "endocrinology",
    price: { amount: 2700 },
    summary: "Консультация эндокринолога, разбор анализов на гормоны.",
    relatedServiceIds: ["thyroid-ultrasound"],
  },

  // — УЗИ и диагностика —
  {
    id: "abdominal-ultrasound",
    title: "УЗИ брюшной полости",
    categoryId: "diagnostics",
    price: { amount: 2900 },
    summary: "Ультразвуковое исследование печени, желчного пузыря, поджелудочной железы и селезёнки.",
    preparation: "Натощак: последний приём пищи за 6–8 часов до исследования.",
    relatedServiceIds: ["kidney-ultrasound", "complex-consultation"],
  },
  {
    id: "kidney-ultrasound",
    title: "УЗИ почек",
    categoryId: "diagnostics",
    price: { amount: 2100, isFrom: true },
    summary: "Ультразвуковое исследование почек.",
    relatedServiceIds: ["abdominal-ultrasound"],
  },
  {
    id: "thyroid-ultrasound",
    title: "УЗИ щитовидной железы",
    categoryId: "diagnostics",
    price: { amount: 1900 },
    summary: "Ультразвуковое исследование щитовидной железы.",
    relatedServiceIds: ["endocrinologist"],
  },
  {
    id: "pelvic-ultrasound",
    title: "УЗИ органов малого таза",
    categoryId: "diagnostics",
    price: { amount: 2500 },
    summary: "Ультразвуковое исследование органов малого таза.",
    relatedServiceIds: ["gynecologist-exam"],
  },

  // — Неврология —
  {
    id: "neurologist",
    title: "Приём невролога",
    categoryId: "neurology",
    price: { amount: 2600 },
    summary: "Консультация невролога, неврологический осмотр.",
    relatedServiceIds: ["neurologist-repeat"],
  },
  {
    id: "neurologist-repeat",
    title: "Приём невролога повторный",
    categoryId: "neurology",
    price: { amount: 2100 },
    summary: "Повторная консультация невролога.",
    relatedServiceIds: ["neurologist"],
  },

  // — Офтальмология —
  {
    id: "ophthalmologist",
    title: "Приём офтальмолога",
    categoryId: "ophthalmology",
    price: { amount: 2300 },
    summary: "Осмотр глаз, проверка зрения, рекомендации.",
    relatedServiceIds: ["vision-check"],
  },
  {
    id: "vision-check",
    title: "Проверка остроты зрения",
    categoryId: "ophthalmology",
    price: { amount: 800 },
    summary: "Проверка остроты зрения по таблице.",
    relatedServiceIds: ["ophthalmologist"],
  },

  // — Дерматология —
  {
    id: "dermatologist",
    title: "Консультация дерматолога",
    categoryId: "dermatology",
    price: { amount: 2500 },
    summary: "Осмотр кожи, консультация дерматолога.",
    relatedServiceIds: ["dermatoscopy"],
  },
  {
    id: "dermatoscopy",
    title: "Дерматоскопия",
    categoryId: "dermatology",
    price: { amount: 1500, isFrom: true },
    summary: "Осмотр родинок и образований кожи дерматоскопом.",
    relatedServiceIds: ["dermatologist"],
  },

  // — Стоматология —
  {
    id: "dentist-consultation",
    title: "Консультация стоматолога",
    categoryId: "dentistry",
    price: { amount: 1000 },
    summary: "Осмотр полости рта и план лечения.",
    relatedServiceIds: ["professional-cleaning"],
  },
  {
    id: "professional-cleaning",
    title: "Профессиональная гигиена полости рта",
    categoryId: "dentistry",
    price: { amount: 4500, isFrom: true },
    summary: "Удаление зубного налёта и камня, полировка.",
    relatedServiceIds: ["dentist-consultation"],
  },
];

/**
 * Услуги блока «Популярные услуги» на главной — в порядке показа.
 * Первые 5 видны на mobile (Homepage-Mobile).
 */
export const mockPopularServiceIds: string[] = [
  "therapist-primary",
  "cardiologist",
  "abdominal-ultrasound",
  "neurologist",
  "pediatrician",
  "gynecologist-exam",
  "ecg",
  "dermatologist",
];
