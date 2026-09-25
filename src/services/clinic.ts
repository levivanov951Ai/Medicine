import type { ClinicInfo } from "@/types/clinic";
import { dataSource } from "./source";

export function getClinicInfo(): Promise<ClinicInfo> {
  return dataSource.getClinicInfo();
}
