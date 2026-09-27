import { dataSource } from "./source";

/**
 * Справочник для личного кабинета: по id из записи — название услуги,
 * врач и анализы. Записи хранят только ссылки (PD-25), подписи всегда
 * берутся из канонических наборов каталога.
 */
export interface AppointmentReferences {
  services: Record<string, { title: string }>;
  doctors: Record<string, { name: string; specialty: string; additionalSpecialties?: string[] }>;
  analyses: Record<string, { title: string }>;
}

export async function getAppointmentReferences(): Promise<AppointmentReferences> {
  const [services, doctors, analyses] = await Promise.all([
    dataSource.getServices(),
    dataSource.getDoctors(),
    dataSource.getAnalyses(),
  ]);
  return {
    services: Object.fromEntries(services.map(({ id, title }) => [id, { title }])),
    doctors: Object.fromEntries(
      doctors.map(({ id, name, specialty, additionalSpecialties }) => [id, { name, specialty, additionalSpecialties }]),
    ),
    analyses: Object.fromEntries(analyses.map(({ id, title }) => [id, { title }])),
  };
}
