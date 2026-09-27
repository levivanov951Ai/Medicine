import { selectImplementation } from "./config";
import type { DataSource } from "./data-source";
import { mockSource } from "./mock-source";

/**
 * Каталог и сведения о клинике: услуги, врачи, анализы, программы, акции.
 * Реализация выбирается переключателем DATA_SOURCE (services/config.ts).
 */
export const dataSource: DataSource = selectImplementation("dataSource", { mock: mockSource });
