import type { IconName } from "./icon";

/**
 * Типы публичного каталога.
 * Это НЕ модель будущей CRM — поля добавляются по мере появления экранов.
 * Необязательные поля: блок страницы выводится, только если данные есть.
 */

/** Цена в рублях. */
export interface Price {
  amount: number;
  /** Цена без скидки. Если задана — показывается зачёркнутой рядом, с меткой «Акция». */
  oldAmount?: number;
  /** Показывать с префиксом «от». */
  isFrom?: boolean;
}

/** Направление каталога: услуги, врачи и анализы группируются по нему. */
export interface Category {
  id: string;
  label: string;
  icon: IconName;
}

export interface Service {
  id: string;
  title: string;
  /** Направление — id из списка категорий услуг. */
  categoryId: string;
  /** Цена в каталоге. У приёма «от» — точная стоимость зависит от врача. */
  price: Price;
  /** Короткое описание под заголовком страницы услуги. */
  summary?: string;
  /** Раздел «Об услуге». */
  description?: string;
  /** Раздел «Когда может быть назначена». */
  indications?: string[];
  /** Раздел «Как проходит приём». */
  steps?: string[];
  /** Раздел «Подготовка». */
  preparation?: string;
  relatedServiceIds?: string[];
}

export interface Analysis {
  id: string;
  title: string;
  /** Раздел лаборатории — id из списка категорий анализов. */
  categoryId: string;
  price: Price;
  /** Срок выполнения, например «1 рабочий день». */
  turnaround: string;
  /** Уточнение срока для страницы анализа: «1 рабочий день, не считая дня забора». */
  turnaroundDetails?: string;
  /** Краткая подготовка, например «Натощак». */
  preparation: string;
  /** Подготовка подробно — блок на странице анализа. */
  preparationDetails?: string;
  /** Подготовка не требуется — на странице выводится отдельным блоком. */
  noPreparation?: boolean;
  /** Короткое описание под заголовком страницы анализа. */
  summary?: string;
  /** Раздел «Об исследовании». */
  description?: string;
  /** Раздел «Биоматериал». */
  biomaterial?: string;
  /** Раздел «Важная информация» — ограничения и противопоказания. */
  restrictions?: string;
  relatedAnalysisIds?: string[];
}

/** Услуга, которую ведёт конкретный врач, и её стоимость у него. */
export interface DoctorService {
  serviceId: string;
  price: Price;
}

export interface Doctor {
  id: string;
  /** В прототипе — заведомо условное имя (PROJECT_CONTEXT.md, 7.3). */
  name: string;
  /** Основная специальность. */
  specialty: string;
  /** Дополнительные специализации — выводятся чипами. */
  additionalSpecialties?: string[];
  /** Направления каталога, в которых врач ведёт приём. */
  categoryIds: string[];
  /** Стоимость основного приёма — «от» на карточке. */
  price: Price;
  experienceYears: number;
  /** Раздел «О враче». */
  bio?: string;
  /** Раздел «Направления работы». */
  focusAreas?: string[];
  /** Раздел «Опыт». */
  experienceNote?: string;
  /** Длительность приёма: «30–40 минут». */
  appointmentDuration?: string;
  /** Раздел «Образование». Реальных данных нет — блок скрыт, пока поле пустое. */
  education?: string[];
  /** Услуги врача. Первая — основной приём, её цена = `price`. */
  services: DoctorService[];
}

export interface Promotion {
  id: string;
  title: string;
  /** Дата окончания, ISO: «2026-10-31». */
  validUntil: string;
}

/** Быстрый переход на главной: направление или раздел сайта. */
export interface QuickLink {
  id: string;
  label: string;
  /** Короткая подпись для mobile (в Design v1: «УЗИ и диагностика» → «УЗИ»). */
  shortLabel?: string;
  icon: IconName;
  href: string;
}

/**
 * Врач с ближайшим свободным временем из расписания (services/availability.ts):
 * «Сегодня, 14:20». `null` — свободного времени в горизонте записи нет.
 */
export interface DoctorWithSlot extends Doctor {
  nextSlotLabel: string | null;
}

/** Данные декоративного превью записи в первом экране главной — из расписания. */
export interface BookingPreview {
  doctorName: string;
  specialty: string;
  /** «Ближайшая запись сегодня». */
  dayLabel: string;
  slots: string[];
  selectedSlot: string;
}
