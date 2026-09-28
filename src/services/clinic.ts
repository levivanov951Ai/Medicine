import { cache } from "react";
import type { ClinicInfo } from "@/types/clinic";
import { dataSource } from "./source";

/**
 * Сведения о клинике. layout.tsx вызывает их дважды (метаданные и разметка) —
 * cache() оставляет один вызов на серверный рендер; между запросами не кешируется.
 */
export const getClinicInfo = cache((): Promise<ClinicInfo> => dataSource.getClinicInfo());
