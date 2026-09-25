import { Container } from "@/components/layout/Container";

interface CatalogLoadingProps {
  /** Текст для скринридера: «Загружаем услуги». */
  label: string;
}

/**
 * Загрузка раздела — состояние «Loading» из Catalog-*, Doctors-*, Analyses-*.dc.html:
 * строки-скелетоны «название — цена». Показывается при переходе в раздел,
 * пока сервер готовит страницу (loading.tsx).
 */
export function CatalogLoading({ label }: CatalogLoadingProps) {
  return (
    <Container className="pt-5 pb-9 md:pt-14 md:pb-[72px]">
      <div role="status">
        <span className="sr-only">{label}</span>
        <div aria-hidden="true" className="motion-safe:animate-pulse">
          <div className="h-3.5 w-24 rounded-md bg-(--color-skeleton)" />
          <div className="mt-4 h-9 w-2/3 max-w-[420px] rounded-[10px] bg-(--color-skeleton) md:h-12" />
          <div className="mt-5 h-12 w-full max-w-[640px] rounded-[14px] bg-(--color-skeleton) md:h-14" />
          <ul className="mt-10 flex max-w-[880px] flex-col lg:ml-[320px]">
            {Array.from({ length: 6 }, (_, index) => (
              <li
                key={index}
                className="flex items-center gap-3.5 border-t border-(--color-border-decorative) py-5"
              >
                <div className="h-3.5 w-[55%] rounded-md bg-(--color-skeleton)" />
                <div className="ml-auto h-3.5 w-[60px] rounded-md bg-(--color-skeleton)" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}
