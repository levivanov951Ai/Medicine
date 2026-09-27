/**
 * Единый переключатель источника данных: MOCK или CRM.
 *
 * Значение — переменная окружения DATA_SOURCE на этапе сборки (см. .env.example):
 *   mock — демонстрационные данные в коде и браузере (по умолчанию);
 *   crm  — настоящая CRM (реализации ещё нет — docs/CRM_INTEGRATION.md).
 *
 * DATA_SOURCE не секрет: next.config.ts передаёт её и в браузерный код,
 * потому что запись, вход и кабинет выполняются в браузере. Секреты CRM
 * сюда не относятся — они только серверные и никогда не NEXT_PUBLIC_*.
 */
export type DataSourceMode = "mock" | "crm";

const MODES: readonly DataSourceMode[] = ["mock", "crm"];

function readMode(): DataSourceMode {
  const raw = process.env.DATA_SOURCE?.trim() || "mock";
  if ((MODES as readonly string[]).includes(raw)) return raw as DataSourceMode;
  throw new Error(`DATA_SOURCE=«${raw}» — неизвестный источник данных. Допустимо: ${MODES.join(", ")}.`);
}

export const dataSourceMode: DataSourceMode = readMode();

/**
 * Реализация сервиса для текущего источника данных.
 * В режиме crm без CRM-реализации — ошибка при сборке и запуске, а не тихий
 * откат на MOCK: production не должен случайно показать демо-данные.
 */
export function selectImplementation<T>(service: string, implementations: { mock: T; crm?: T }): T {
  if (dataSourceMode === "mock") return implementations.mock;
  if (implementations.crm) return implementations.crm;
  throw new Error(
    `DATA_SOURCE=crm, но CRM-реализация «${service}» ещё не подключена. См. docs/CRM_INTEGRATION.md.`,
  );
}
