"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/StateBlocks";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-16 md:py-24">
      <ErrorState
        className="mx-auto max-w-[480px]"
        title="Не удалось загрузить данные"
        description="Проверьте интернет-соединение и попробуйте ещё раз."
        action={
          <Button variant="secondary" size="sm" onClick={reset}>
            Обновить
          </Button>
        }
      />
    </Container>
  );
}
