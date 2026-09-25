const rubFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** 2400 → «2 400 ₽» (неразрывные пробелы, как в Design v1). */
export function formatRub(amount: number): string {
  return `${rubFormatter.format(amount)} ₽`;
}

const dayMonthFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

/** «2026-10-31» → «31 октября». */
export function formatDayMonth(isoDate: string): string {
  return dayMonthFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}
