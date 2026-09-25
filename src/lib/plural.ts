/**
 * Русское склонение по числу: pluralize(3, ["анализ", "анализа", "анализов"]) → «анализа».
 */
export function pluralize(count: number, [one, few, many]: [string, string, string]): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** «3 анализа», «21 год». */
export function countLabel(count: number, forms: [string, string, string]): string {
  return `${count} ${pluralize(count, forms)}`;
}

export const WORDS = {
  service: ["услуга", "услуги", "услуг"],
  doctor: ["врач", "врача", "врачей"],
  analysis: ["анализ", "анализа", "анализов"],
  study: ["исследование", "исследования", "исследований"],
  year: ["год", "года", "лет"],
} satisfies Record<string, [string, string, string]>;
