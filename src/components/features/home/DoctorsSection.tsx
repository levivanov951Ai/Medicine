import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { DoctorCard } from "@/components/features/doctors/DoctorCard";
import { routes } from "@/lib/routes";
import type { DoctorWithSlot } from "@/types/catalog";

interface DoctorsSectionProps {
  doctors: DoctorWithSlot[];
}

/**
 * «03 · Команда — Врачи». Горизонтальная лента на всех ширинах —
 * на desktop 5 карточек не помещаются в 1200px и прокручиваются (как в макете).
 * Mobile — 3 карточки.
 */
export function DoctorsSection({ doctors }: DoctorsSectionProps) {
  return (
    <section aria-labelledby="doctors-title">
      <Container className="pt-9 pb-2 md:py-16">
        <SectionHeading
          id="doctors-title"
          eyebrow="03 · Команда"
          title="Врачи"
          link={{ href: routes.doctors, label: "Все врачи" }}
        />
        <ul className="scroll-row -mx-4 gap-3.5 px-4 pb-2 md:mx-0 md:gap-5 md:px-0">
          {doctors.map((doctor) => (
            <li key={doctor.id} className="shrink-0 max-md:nth-[n+4]:hidden">
              <DoctorCard doctor={doctor} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
