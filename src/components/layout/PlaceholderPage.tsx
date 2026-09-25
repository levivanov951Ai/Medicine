import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/routes";
import { Container } from "./Container";

interface PlaceholderPageProps {
  title: string;
}

/**
 * Временная техническая страница для маршрутов, которые ещё не реализованы.
 * Нужна, чтобы ссылки с главной работали, а не вели в никуда.
 */
export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <Container className="py-16 md:py-24">
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 text-center">
        <h1 className="text-[30px] leading-[38px] font-bold text-(--color-text-primary) md:text-[44px] md:leading-[52px]">
          {title}
        </h1>
        <p className="text-[17px] leading-[26px] text-(--color-text-secondary)">
          Этот раздел ещё в разработке.
        </p>
        <Button href={routes.home} variant="secondary" size="md" className="mt-2">
          На главную
        </Button>
      </div>
    </Container>
  );
}
