import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { routes } from "@/lib/routes";
import { getClinicInfo } from "@/services/clinic";
import type { IconName } from "@/types/icon";

export const metadata: Metadata = {
  title: "О клинике",
  description: "Врачи и лаборатория в одном месте. Запись онлайн подтверждается сразу.",
};

/**
 * Каждый пункт — FACT или PRODUCT DECISION из PROJECT_CONTEXT.md, в скобках источник.
 * Годы работы, число пациентов и врачей, лицензии, оборудование и награды — UNKNOWN
 * и здесь намеренно не упоминаются (PROJECT_CONTEXT.md, 7.1).
 */
const facts: Array<{ icon: IconName; title: string; text: string }> = [
  {
    icon: "stethoscope",
    title: "Врача и время выбираете сами",
    text: "Видно свободное время каждого врача — без звонка в регистратуру.", // FACT 2.4
  },
  {
    icon: "check-circle",
    title: "Запись подтверждается сразу",
    text: "После записи вы сразу видите дату, время и адрес — ждать звонка не нужно.", // FACT 2.4
  },
  {
    icon: "flask",
    title: "Анализы — по той же схеме",
    text: "Выберите исследования в каталоге и удобное время процедурного кабинета.", // FACT 2.5, PD-04
  },
  {
    icon: "user",
    title: "Вход по номеру телефона",
    text: "Без пароля и отдельной регистрации: код из смс — и вы в личном кабинете.", // PD-01
  },
  {
    icon: "list",
    title: "Цены — сразу в каталоге",
    text: "Стоимость услуг и анализов видна в списках, отдельная страница цен не нужна.", // PD-08
  },
  {
    icon: "briefcase",
    title: "Оплата — в клинике",
    text: "Предоплаты на сайте нет: расчёт при визите.", // PD-11
  },
];

const sections: Array<{ label: string; href: string; icon: IconName }> = [
  { label: "Услуги и цены", href: routes.services, icon: "list" },
  { label: "Врачи", href: routes.doctors, icon: "stethoscope" },
  { label: "Анализы", href: routes.lab, icon: "flask" },
  { label: "Контакты", href: routes.contacts, icon: "pin" },
];

/**
 * «О клинике». Отдельного макета в Design v1 нет — страница собрана из блоков
 * Design System и секции «О клинике» главной (фото-заглушка, список с галочками,
 * плашки иконок).
 */
export default async function AboutPage() {
  const clinic = await getClinicInfo();

  return (
    <>
      <Container className="pt-5 pb-8 md:pt-10 md:pb-12 lg:flex lg:items-center lg:gap-14">
        <div className="flex flex-col gap-2.5 lg:max-w-[560px] lg:gap-4">
          <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">О клинике</p>
          <h1 className="text-[28px] leading-9 font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
            Врачи и анализы — в одном месте
          </h1>
          <p className="text-[16px] leading-6 text-(--color-text-secondary) md:text-[18px] md:leading-7">
            Один филиал по адресу {clinic.address}. Приём и лаборатория работают вместе — приходите на осмотр и
            сдавайте анализы за один визит.
          </p>
          <div className="mt-2 flex flex-col gap-3 md:flex-row">
            <Button href={routes.booking} fullWidth className="md:w-auto">
              Записаться к врачу
            </Button>
            <Button href={routes.lab} variant="secondary" fullWidth className="md:w-auto">
              Сдать анализы
            </Button>
          </div>
        </div>
        <MediaPlaceholder
          label="Фото клиники"
          icon="pin"
          iconSize={56}
          className="mt-6 h-[200px] w-full rounded-(--radius-l) md:h-[280px] lg:mt-0 lg:h-[320px] lg:flex-1 lg:rounded-[20px]"
        />
      </Container>

      <section aria-labelledby="about-how" className="bg-(--color-surface-page)">
        <Container className="py-9 md:py-14">
          <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent-on-tinted) uppercase">
            Как всё устроено
          </p>
          <h2
            id="about-how"
            className="mt-1.5 text-[24px] leading-8 font-bold text-(--color-text-primary) md:mt-2 md:text-[32px] md:leading-10"
          >
            Просто и без звонков
          </h2>
          <ul className="mt-5 grid gap-3.5 md:mt-8 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
            {facts.map((fact) => (
              <li
                key={fact.title}
                className="flex items-start gap-3.5 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-[18px] md:p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-(--radius-m) bg-(--color-icon-plate-bg) text-(--color-icon-plate-fg)">
                  <Icon name={fact.icon} size={22} />
                </span>
                <div>
                  <h3 className="text-[16px] leading-[22px] font-bold text-(--color-text-primary)">{fact.title}</h3>
                  <p className="mt-1 text-[14px] leading-5 text-(--color-text-secondary)">{fact.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-9 md:py-14">
        <h2 className="text-[24px] leading-8 font-bold text-(--color-text-primary) md:text-[32px] md:leading-10">
          Разделы сайта
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
          {sections.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="flex h-full min-h-14 items-center gap-3 rounded-(--radius-l) border border-(--color-border-decorative) bg-(--color-surface-card) p-3.5 text-[15px] font-semibold text-(--color-text-primary) shadow-(--shadow-s) hover:bg-(--color-surface-hover) hover:text-(--color-nav-active-text) md:p-5 md:text-[16px]"
              >
                <span className="flex text-(--color-icon-accent)">
                  <Icon name={section.icon} size={22} />
                </span>
                {section.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
