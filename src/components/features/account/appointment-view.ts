import { countLabel, WORDS } from "@/lib/plural";
import type { AppointmentReferences } from "@/services/account";
import type { Appointment } from "@/types/appointment";
import type { IconName } from "@/types/icon";

/** Подписи записи для кабинета — из канонических наборов каталога по id. */
export interface AppointmentView {
  icon: IconName;
  /** «Приём кардиолога первичный» / «Запись на анализы» / название единственного анализа. */
  title: string;
  /** Строка под названием в списке (desktop). */
  subtitle: string;
  /** Короче — для mobile: «Липидный профиль и ещё 2». */
  subtitleShort: string;
  doctor: { name: string; specialty: string; specialtyFull: string } | null;
  /** Названия анализов записи на анализы. */
  analyses: string[];
}

export function describeAppointment(appointment: Appointment, refs: AppointmentReferences): AppointmentView {
  if (appointment.type === "doctor") {
    const service = refs.services[appointment.serviceId];
    const doctor = refs.doctors[appointment.doctorId];
    const specialty = doctor?.specialty.toLocaleLowerCase("ru-RU") ?? "";
    const line = doctor ? `${doctor.name} · ${specialty}` : "";
    return {
      icon: "stethoscope",
      title: service?.title ?? "Приём врача",
      subtitle: line,
      subtitleShort: line,
      doctor: doctor
        ? {
            name: doctor.name,
            specialty: doctor.specialty,
            specialtyFull: [doctor.specialty, ...(doctor.additionalSpecialties ?? [])]
              .map((item, index) => (index === 0 ? item : item.toLocaleLowerCase("ru-RU")))
              .join(" · "),
          }
        : null,
      analyses: [],
    };
  }

  // Анализ, которого больше нет в каталоге, в списке не показываем, но в стоимости он учтён.
  const analyses = appointment.analysisIds.flatMap((id) => (refs.analyses[id] ? [refs.analyses[id].title] : []));
  const count = appointment.analysisIds.length;
  const studies = countLabel(count, WORDS.study);
  if (count === 1 && analyses[0]) {
    return { icon: "flask", title: analyses[0], subtitle: studies, subtitleShort: studies, doctor: null, analyses };
  }
  const rest = count - 1;
  const first = analyses[0];
  return {
    icon: "flask",
    title: "Запись на анализы",
    subtitle: first ? `${first} и ещё ${countLabel(rest, WORDS.study)}` : studies,
    subtitleShort: first ? `${first} и ещё ${rest}` : studies,
    doctor: null,
    analyses,
  };
}
