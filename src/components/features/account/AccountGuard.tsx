"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { LoadingState } from "@/components/ui/StateBlocks";
import { useAuth } from "@/lib/auth-session";
import { routes } from "@/lib/routes";
import { AccountNav } from "./AccountNav";

/**
 * Доступ к личному кабинету только после входа.
 *
 * ⚠️ Это MOCK-защита в браузере для демонстрации сценария, а НЕ защита данных:
 * сессия лежит в localStorage, проверки на сервере нет. Настоящая защита
 * (серверная сессия, проверка доступа к каждой записи) появится вместе
 * с реальной авторизацией и CRM.
 *
 * Гость → /login?next=<текущий адрес>; после входа он вернётся сюда.
 * Пациент только что вышел сам → на главную, а не на страницу входа.
 */
export function AccountGuard({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const guest = auth.status === "guest";
  // Был в кабинете и стал гостем — значит, вышел (здесь или в соседней вкладке).
  const signedInHere = useRef(false);
  useEffect(() => {
    if (auth.status === "authenticated") signedInHere.current = true;
  }, [auth.status]);
  useEffect(() => {
    if (!guest) return;
    if (signedInHere.current) router.replace(routes.home);
    else router.replace(routes.loginWithReturn(`${pathname}${window.location.search}`));
  }, [guest, pathname, router]);

  if (auth.status !== "authenticated") {
    return (
      <Container className="py-10 md:py-16">
        <LoadingState label={guest ? "Переходим ко входу" : "Загружаем личный кабинет"} className="max-w-[720px]" />
      </Container>
    );
  }

  return (
    <>
      <AccountNav />
      {children}
    </>
  );
}
