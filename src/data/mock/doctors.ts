/**
 * ⚠️ MOCK — временные данные прототипа (PROJECT_CONTEXT.md, PD-20).
 * НЕ являются сведениями клиники: реальные врачи — UNKNOWN.
 * Имена заведомо условные (PROJECT_CONTEXT.md, 7.3), чтобы их нельзя
 * было принять за реальных сотрудников.
 *
 * КАНОНИЧЕСКИЙ набор MOCK-врачей (PROJECT_CONTEXT.md, PD-25): главная,
 * каталог врачей, страницы врачей и блок «Кто ведёт приём» на странице
 * услуги берут данные только отсюда через service layer.
 *
 * Первые пять врачей — значения главной (Homepage-Desktop), не менять.
 * Расхождения макетов каталога и профиля (Doctors-*, DoctorProfile-*,
 * Service-*) в данные не переносятся: там те же имена имеют другие
 * специальности и цены. Стаж и описания взяты из этих макетов.
 *
 * Цена врача на карточке («от …») — цена его основного приёма, то есть
 * первой услуги в `services`. Она вычисляется, а не дублируется.
 */
import type { Doctor } from "@/types/catalog";

type DoctorInput = Omit<Doctor, "price">;

function defineDoctor(doctor: DoctorInput): Doctor {
  const [primary] = doctor.services;
  return { ...doctor, price: { ...primary.price, isFrom: true } };
}

export const mockDoctors: Doctor[] = [
  defineDoctor({
    id: "doctor-a",
    name: "Врач А. А.",
    specialty: "Терапевт",
    categoryIds: ["therapy"],
    nextSlotLabel: "Сегодня, 14:20",
    experienceYears: 14,
    appointmentDuration: "30 минут",
    bio: "Ведёт приём взрослых пациентов: разбирает жалобы, читает уже имеющиеся обследования и подробно объясняет дальнейший план — какие анализы или консультации нужны и почему.",
    focusAreas: ["Терапия", "Профилактические осмотры", "Разбор результатов анализов"],
    experienceNote: "14 лет общего стажа, из них 8 лет — амбулаторный приём взрослых.",
    services: [
      { serviceId: "therapist-primary", price: { amount: 2400 } },
      { serviceId: "preventive-exam", price: { amount: 2400 } },
      { serviceId: "complex-consultation", price: { amount: 2800 } },
    ],
  }),
  defineDoctor({
    id: "specialist-1",
    name: "Специалист №1",
    specialty: "Кардиолог",
    categoryIds: ["cardiology"],
    nextSlotLabel: "Завтра, 10:00",
    experienceYears: 8,
    appointmentDuration: "30–40 минут",
    bio: "Ведёт приём взрослых с заболеваниями сердечно-сосудистой системы, подбирает обследования и наблюдение.",
    focusAreas: ["Кардиология", "Функциональная диагностика"],
    services: [
      { serviceId: "cardiologist", price: { amount: 3100 } },
      { serviceId: "cardiologist-repeat", price: { amount: 2600 } },
      { serviceId: "ecg", price: { amount: 1400 } },
      { serviceId: "bp-monitoring", price: { amount: 2900 } },
    ],
  }),
  defineDoctor({
    id: "specialist-2",
    name: "Специалист №2",
    specialty: "Педиатр",
    additionalSpecialties: ["Детский кардиолог"],
    categoryIds: ["pediatrics", "cardiology"],
    nextSlotLabel: "Сегодня, 16:40",
    experienceYears: 21,
    appointmentDuration: "30–40 минут",
    bio: "Ведёт приём детей: плановые осмотры, консультации при жалобах со стороны сердца, подробно объясняет родителям дальнейший план.",
    focusAreas: ["Педиатрия", "Детская кардиология"],
    experienceNote: "21 год общего стажа, из них 9 лет — амбулаторный приём детей с кардиологическими диагнозами.",
    services: [
      { serviceId: "pediatrician", price: { amount: 2200 } },
      { serviceId: "pediatric-cardiologist", price: { amount: 2700 } },
      { serviceId: "child-certificate", price: { amount: 900 } },
    ],
  }),
  defineDoctor({
    id: "doctor-b",
    name: "Врач Б. Б.",
    specialty: "Гинеколог",
    categoryIds: ["gynecology"],
    nextSlotLabel: "Завтра, 09:30",
    experienceYears: 11,
    appointmentDuration: "30 минут",
    bio: "Ведёт приём по гинекологии: плановые осмотры, консультации по результатам обследований.",
    focusAreas: ["Гинекология", "Ультразвуковая диагностика"],
    services: [
      { serviceId: "gynecologist-exam", price: { amount: 2600 } },
      { serviceId: "gynecologist-repeat", price: { amount: 2100 } },
      { serviceId: "pelvic-ultrasound", price: { amount: 2500 } },
    ],
  }),
  defineDoctor({
    id: "specialist-3",
    name: "Специалист №3",
    specialty: "Дерматолог",
    categoryIds: ["dermatology"],
    nextSlotLabel: "Сегодня, 18:00",
    experienceYears: 5,
    appointmentDuration: "20–30 минут",
    bio: "Консультирует по заболеваниям кожи, проводит осмотр родинок и образований.",
    focusAreas: ["Дерматология", "Дерматоскопия"],
    services: [
      { serviceId: "dermatologist", price: { amount: 2500 } },
      { serviceId: "dermatoscopy", price: { amount: 1500 } },
    ],
  }),

  // — Ниже: врачи, добавленные для каталога. На главной не показываются. —
  defineDoctor({
    id: "doctor-v",
    name: "Врач В. В.",
    specialty: "Терапевт",
    categoryIds: ["therapy"],
    nextSlotLabel: "Завтра, 11:20",
    experienceYears: 9,
    bio: "Ведёт приём взрослых пациентов, оформляет справки и больничные листы.",
    focusAreas: ["Терапия"],
    services: [
      { serviceId: "therapist-primary", price: { amount: 2400 } },
      { serviceId: "therapist-repeat", price: { amount: 1900 } },
      { serviceId: "pool-certificate", price: { amount: 1200 } },
      { serviceId: "sick-leave", price: { amount: 1000 } },
    ],
  }),
  defineDoctor({
    id: "specialist-4",
    name: "Специалист №4",
    specialty: "Кардиолог",
    categoryIds: ["cardiology"],
    nextSlotLabel: "Завтра, 12:30",
    experienceYears: 17,
    bio: "Ведёт приём взрослых с заболеваниями сердца, проводит УЗИ сердца.",
    focusAreas: ["Кардиология", "Эхокардиография"],
    services: [
      { serviceId: "cardiologist", price: { amount: 3100 } },
      { serviceId: "echocardiography", price: { amount: 3200 } },
    ],
  }),
  defineDoctor({
    id: "specialist-5",
    name: "Специалист по кардиологии и функциональной диагностике №5",
    specialty: "Кардиолог",
    additionalSpecialties: ["Врач функциональной диагностики"],
    categoryIds: ["cardiology", "diagnostics"],
    nextSlotLabel: "Сегодня, 17:10",
    experienceYears: 12,
    focusAreas: ["Кардиология", "Функциональная диагностика"],
    services: [
      { serviceId: "cardiologist-repeat", price: { amount: 2700 } },
      { serviceId: "ecg", price: { amount: 1400 } },
      { serviceId: "holter", price: { amount: 3300 } },
      { serviceId: "bp-monitoring", price: { amount: 2900 } },
    ],
  }),
  defineDoctor({
    id: "doctor-g",
    name: "Врач Г. Г.",
    specialty: "Невролог",
    categoryIds: ["neurology"],
    nextSlotLabel: "Завтра, 15:00",
    experienceYears: 10,
    focusAreas: ["Неврология"],
    services: [
      { serviceId: "neurologist", price: { amount: 2600 } },
      { serviceId: "neurologist-repeat", price: { amount: 2100 } },
    ],
  }),
  defineDoctor({
    id: "doctor-d",
    name: "Врач Д. Д.",
    specialty: "Эндокринолог",
    categoryIds: ["endocrinology"],
    nextSlotLabel: "Сегодня, 13:40",
    experienceYears: 7,
    focusAreas: ["Эндокринология"],
    services: [{ serviceId: "endocrinologist", price: { amount: 2700 } }],
  }),
  defineDoctor({
    id: "specialist-6",
    name: "Специалист №6",
    specialty: "Офтальмолог",
    categoryIds: ["ophthalmology"],
    nextSlotLabel: "Завтра, 10:40",
    experienceYears: 6,
    focusAreas: ["Офтальмология"],
    services: [
      { serviceId: "ophthalmologist", price: { amount: 2300 } },
      { serviceId: "vision-check", price: { amount: 800 } },
    ],
  }),
  defineDoctor({
    id: "specialist-7",
    name: "Специалист №7",
    specialty: "Врач УЗИ-диагностики",
    categoryIds: ["diagnostics"],
    nextSlotLabel: "Сегодня, 15:30",
    experienceYears: 15,
    focusAreas: ["Ультразвуковая диагностика"],
    services: [
      { serviceId: "abdominal-ultrasound", price: { amount: 2900 } },
      { serviceId: "kidney-ultrasound", price: { amount: 2100 } },
      { serviceId: "thyroid-ultrasound", price: { amount: 1900 } },
      { serviceId: "pelvic-ultrasound", price: { amount: 2500 } },
    ],
  }),
  defineDoctor({
    id: "doctor-e",
    name: "Врач Е. Е.",
    specialty: "Стоматолог",
    categoryIds: ["dentistry"],
    nextSlotLabel: "Завтра, 09:00",
    experienceYears: 8,
    focusAreas: ["Стоматология"],
    services: [
      { serviceId: "dentist-consultation", price: { amount: 1000 } },
      { serviceId: "professional-cleaning", price: { amount: 4500 } },
    ],
  }),
];
