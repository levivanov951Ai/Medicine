import { Container } from "@/components/layout/Container";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

interface AboutSectionProps {
  address: string;
}

/** Пункты: [desktop, mobile] — в Design v1 на mobile тексты короче. */
const points: Array<[string, string]> = [
  ["Расписание врачей видно сразу, без звонка", "Расписание видно сразу, без звонка"],
  ["Один адрес — не нужно уточнять, куда ехать", "Один адрес — без путаницы"],
  ["Подтверждение записи приходит сразу", "Подтверждение приходит сразу"],
];

/**
 * «05 · О клинике». Утверждения — из подтверждённых фактов и продуктовых
 * решений: один филиал, запись подтверждается сразу (PROJECT_CONTEXT.md).
 */
export function AboutSection({ address }: AboutSectionProps) {
  return (
    <section aria-labelledby="about-title">
      <Container className="py-8 md:py-12 lg:flex lg:items-center lg:gap-14">
        <MediaPlaceholder
          label="Фото клиники"
          icon="pin"
          iconSize={48}
          compactLabel
          className="h-[180px] w-full rounded-(--radius-l) md:h-[280px] lg:hidden"
        />
        <MediaPlaceholder
          label="Фото клиники"
          icon="pin"
          iconSize={64}
          className="hidden h-[280px] w-[440px] rounded-[20px] lg:flex"
        />

        <div className="mt-5 flex flex-col lg:mt-0 lg:max-w-[560px] lg:gap-4">
          <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">
            05 · О клинике
          </p>
          <h2
            id="about-title"
            className="mt-1.5 text-[24px] leading-8 font-bold text-(--color-text-primary) md:text-[32px] md:leading-10 lg:mt-0"
          >
            Врачи и анализы — в одном месте
          </h2>
          <p className="mt-3 text-[16px] leading-6 text-(--color-text-secondary) md:text-[17px] md:leading-[26px] lg:mt-0">
            Один филиал по адресу {address}. Приём и лаборатория работают вместе
            <span className="md:hidden">.</span>
            <span className="hidden md:inline"> — приходите на осмотр и сдавайте анализы за один визит.</span>
          </p>
          <ul className="mt-3.5 flex flex-col gap-2.5 lg:mt-0">
            {points.map(([desktop, mobile]) => (
              <li key={desktop} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex text-(--color-icon-strong)">
                  <Icon name="check" size={16} className="size-[15px] md:size-4" />
                </span>
                <span className="text-[14px] leading-5 text-(--color-text-primary) md:text-[15px] md:leading-[22px]">
                  <span className="md:hidden">{mobile}</span>
                  <span className="hidden md:inline">{desktop}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
