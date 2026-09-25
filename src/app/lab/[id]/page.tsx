import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalysisPageAction } from "@/components/features/analyses/AnalysisPageAction";
import { AnalysisSelectButton } from "@/components/features/analyses/AnalysisSelectButton";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { ContentSection } from "@/components/layout/ContentSection";
import { Badge } from "@/components/ui/Badge";
import { ChipLink } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Price } from "@/components/ui/Price";
import { routes } from "@/lib/routes";
import { getAnalysisPage } from "@/services/analyses";
import type { Price as PriceValue } from "@/types/catalog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getAnalysisPage((await params).id);
  if (!data) return {};
  return { title: data.analysis.title, description: data.analysis.summary };
}

/**
 * Страница анализа — Analysis-Desktop / Analysis-Mobile.
 * Цена, срок, подготовка и акция видны без записи (FACT 2.5).
 * «Добавить к записи» кладёт анализ в выбранные — то же состояние,
 * что в каталоге и на странице «Выбранные анализы» (PD-04).
 */
export default async function AnalysisPage({ params }: PageProps) {
  const data = await getAnalysisPage((await params).id);
  if (!data) notFound();

  const { analysis, category, related } = data;
  const hasDiscount = analysis.price.oldAmount !== undefined;

  const crumbs = [
    { label: "Анализы", href: routes.lab },
    ...(category ? [{ label: category.label, href: routes.labCatalog({ category: category.id }) }] : []),
  ];

  return (
    <>
      <Container className="pt-5 pb-7 md:pt-10 md:pb-16">
        <Breadcrumbs items={crumbs} current={analysis.title} />
        <div className="mt-3.5 flex max-w-[700px] flex-col gap-3 md:mt-7 md:gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <ChipLink href={routes.labCatalog({ category: category.id })} icon={category.icon}>
                {category.label}
              </ChipLink>
            )}
            {hasDiscount && (
              <span className="md:hidden">
                <Badge tone="promo" size="lg">
                  Акция
                </Badge>
              </span>
            )}
          </div>
          <h1 className="text-[26px] leading-[33px] font-bold break-words text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
            {analysis.title}
          </h1>
          {analysis.summary && (
            <p className="text-[16px] leading-6 text-(--color-text-secondary) md:text-[18px] md:leading-7">
              {analysis.summary}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 md:mt-0">
            <PriceWithPromo price={analysis.price} promoBadgeClassName="hidden md:inline" />
            <p className="flex items-center gap-1.5 text-[14px] text-(--color-text-secondary) md:text-[15px]">
              <Icon name="clock" size={18} className="size-4 md:size-[18px]" />
              <span className="sr-only">Срок выполнения: </span>
              {analysis.turnaround}
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <AnalysisPageAction analysisId={analysis.id} title={analysis.title} />
          </div>
        </div>
      </Container>

      <Container>
        {analysis.description && (
          <ContentSection id="about-title" title="Об исследовании">
            <p className="max-w-[780px] text-[16px] leading-6 text-(--color-text-secondary) md:text-[17px] md:leading-[26px]">
              {analysis.description}
            </p>
          </ContentSection>
        )}
        <ContentSection id="preparation-title" title="Подготовка">
          {analysis.noPreparation ? (
            <div className="flex max-w-[640px] items-start gap-3 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-page) px-[18px] py-4">
              <span className="mt-px flex shrink-0 text-(--color-text-secondary)">
                <Icon name="check-circle" size={20} />
              </span>
              <p className="text-[15px] leading-[22px] text-(--color-text-primary)">
                Без специальной подготовки — можно сдать в любое время дня.
              </p>
            </div>
          ) : (
            <div className="flex max-w-[640px] items-start gap-3 rounded-[14px] border border-(--color-border-accent) bg-(--color-surface-accent) px-5 py-[18px]">
              <span className="mt-px flex shrink-0 text-(--color-icon-strong)">
                <Icon name="file-text" size={20} />
              </span>
              <p className="text-[15px] leading-[23px] text-(--color-text-primary)">
                {analysis.preparationDetails ?? analysis.preparation}
              </p>
            </div>
          )}
        </ContentSection>
        {analysis.biomaterial && (
          <ContentSection id="biomaterial-title" title="Биоматериал">
            <p className="flex items-center gap-2.5 text-[15px] text-(--color-text-primary) md:text-[16px]">
              <span className="flex text-(--color-icon-strong)">
                <Icon name="drop" size={20} className="size-[18px] md:size-5" />
              </span>
              {analysis.biomaterial}
            </p>
          </ContentSection>
        )}
        <ContentSection id="turnaround-title" title="Срок выполнения">
          <p className="flex items-center gap-2.5 text-[15px] text-(--color-text-primary) md:text-[16px]">
            <span className="flex text-(--color-icon-strong)">
              <Icon name="clock" size={20} className="size-[18px] md:size-5" />
            </span>
            {analysis.turnaroundDetails ?? analysis.turnaround}
          </p>
        </ContentSection>
        <ContentSection id="price-title" title="Стоимость">
          <div className="flex max-w-[640px] flex-wrap items-center justify-between gap-3 rounded-[14px] border border-(--color-border-decorative) px-[18px] py-4 md:px-[22px] md:py-[18px]">
            <p className="text-[15px] font-semibold text-(--color-text-primary) md:mr-4 md:text-[16px]">
              <span className="md:hidden">Стоимость анализа</span>
              <span className="hidden md:inline">{analysis.title}</span>
            </p>
            <PriceWithPromo price={analysis.price} />
          </div>
        </ContentSection>
        {analysis.restrictions && (
          <ContentSection id="restrictions-title" title="Важная информация">
            <div className="flex max-w-[700px] items-start gap-3 rounded-[14px] border-[1.5px] border-dashed border-(--color-border-decorative) px-4 py-3.5 md:px-5 md:py-4">
              <span className="mt-px flex shrink-0 text-(--color-icon-muted)">
                <Icon name="alert" size={18} />
              </span>
              <p className="text-[13px] leading-[19px] text-(--color-text-secondary) md:text-[14px] md:leading-[21px]">
                {analysis.restrictions}
              </p>
            </div>
          </ContentSection>
        )}
      </Container>

      {related.length > 0 && (
        <Container className="pt-2 pb-6 md:pb-14">
          <section aria-labelledby="related-title">
            <h2
              id="related-title"
              className="mb-3.5 text-[12px] font-bold tracking-[.05em] text-(--color-text-secondary) uppercase md:text-[13px]"
            >
              Связанные исследования
            </h2>
            <ul className="scroll-row -mx-4 gap-2.5 px-4 pb-2 md:mx-0 md:gap-4 md:px-0">
              {related.map(({ analysis: item }) => (
                <li key={item.id} className="shrink-0">
                  <article className="flex h-full w-[230px] flex-col gap-2.5 rounded-[14px] border border-(--color-border-decorative) bg-(--color-surface-card) p-4 md:w-[280px] md:p-[18px]">
                    <h3 className="text-[14px] leading-5 font-semibold text-(--color-text-primary) md:text-[15px] md:leading-[21px]">
                      <Link href={routes.analysis(item.id)} className="rounded-(--radius-s) hover:underline">
                        {item.title}
                      </Link>
                    </h3>
                    <div className="mt-auto flex items-center justify-between gap-3">
                      <Price price={item.price} size="xs" />
                      <AnalysisSelectButton analysisId={item.id} title={item.title} />
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      )}
    </>
  );
}

/** Цена анализа крупно; при скидке — метка «Акция» рядом. */
function PriceWithPromo({ price, promoBadgeClassName }: { price: PriceValue; promoBadgeClassName?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <Price price={price} size="xl" />
      {price.oldAmount !== undefined && (
        <span className={promoBadgeClassName}>
          <Badge tone="promo" size="lg">
            Акция
          </Badge>
        </span>
      )}
    </div>
  );
}
