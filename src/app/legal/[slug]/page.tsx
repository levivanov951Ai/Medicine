import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/StateBlocks";
import { legalDocuments } from "@/data/legal";
import { legalNav } from "@/lib/navigation";
import { routes } from "@/lib/routes";

/** Только известные правовые страницы; остальные адреса — 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocuments.map((document) => ({ slug: document.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

const findDocument = (slug: string) => legalDocuments.find((document) => document.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const document = findDocument((await params).slug);
  return { title: document?.title, robots: { index: false } };
}

/**
 * Правовой документ. Отдельного макета в Design v1 нет — типографика и блоки
 * из Design System. Пока клиника не предоставила текст (UNKNOWN), показывается
 * честное сообщение, а не сгенерированный «юридический» текст.
 */
export default async function LegalPage({ params }: Props) {
  const document = findDocument((await params).slug);
  if (!document) notFound();

  const others = legalNav.filter((item) => item.slug !== document.slug);

  return (
    <Container className="pt-5 pb-10 md:pt-10 md:pb-16">
      <article className="max-w-[760px]">
        <p className="text-[13px] font-bold tracking-[.06em] text-(--color-text-accent) uppercase">
          Правовая информация
        </p>
        <h1 className="mt-2 text-[26px] leading-[33px] font-bold text-(--color-text-primary) md:mt-3 md:text-[36px] md:leading-[44px]">
          {document.title}
        </h1>

        {document.content ? (
          <div className="mt-6 text-[16px] leading-6 whitespace-pre-line text-(--color-text-primary) md:mt-8 md:text-[17px] md:leading-[26px]">
            {document.content}
          </div>
        ) : (
          <Notice
            tone="neutral"
            icon="file-text"
            className="mt-5 md:mt-8"
            title="Документ будет опубликован после предоставления клиникой"
            description="Текст документа и реквизиты организации появятся здесь, как только клиника их передаст."
            action={
              <Button href={routes.contacts} variant="secondary" size="sm">
                Контакты клиники
              </Button>
            }
          />
        )}

        {others.length > 0 && (
          <nav aria-label="Другие документы" className="mt-8 border-t border-(--color-border-decorative) pt-5 md:mt-10">
            <h2 className="text-[15px] font-bold text-(--color-text-primary)">Другие документы</h2>
            <ul className="mt-2 flex flex-col">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-[15px] font-semibold text-(--color-text-link) hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </Container>
  );
}
