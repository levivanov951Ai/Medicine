import type { IconName } from "./icon";

/**
 * Минимальные типы для текущего UI (Homepage).
 * Это НЕ модель будущей CRM — поля добавляются по мере появления экранов.
 */

/** Цена в рублях. */
export interface Price {
  amount: number;
  /** Цена без скидки. Если задана — показывается зачёркнутой рядом. */
  oldAmount?: number;
  /** Показывать с префиксом «от». */
  isFrom?: boolean;
}

export interface Service {
  id: string;
  title: string;
  /** Название направления, выводится меткой на карточке. */
  categoryLabel: string;
  price: Price;
}

export interface Analysis {
  id: string;
  title: string;
  price: Price;
  /** Срок выполнения, например «1 рабочий день». */
  turnaround: string;
  /** Краткая подготовка, например «Натощак». */
  preparation: string;
}

export interface Doctor {
  id: string;
  /** В прототипе — заведомо условное имя (PROJECT_CONTEXT.md, 7.3). */
  name: string;
  specialty: string;
  price: Price;
  /** Ближайшее свободное время, готовая подпись: «Сегодня, 14:20». */
  nextSlotLabel: string;
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

/** Данные декоративного превью записи в первом экране главной. */
export interface BookingPreview {
  doctorName: string;
  specialty: string;
  slots: string[];
  selectedSlot: string;
}
