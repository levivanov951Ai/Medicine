import type { DataSource } from "./data-source";
import { mockSource } from "./mock-source";

/**
 * Единственная точка выбора источника данных.
 * При подключении CRM здесь меняется одна строка.
 */
export const dataSource: DataSource = mockSource;
