import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateBlocks";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <Container className="py-16 md:py-24">
      <EmptyState
        title="Страница не найдена"
        titleAs="h1"
        description="Возможно, адрес набран с ошибкой или страница была перемещена."
        action={
          <Button href={routes.home} variant="secondary" size="sm">
            На главную
          </Button>
        }
      />
    </Container>
  );
}
