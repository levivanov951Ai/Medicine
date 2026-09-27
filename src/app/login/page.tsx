import type { Metadata } from "next";
import { LoginView } from "@/components/features/auth/LoginView";
import { safeReturnPath } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Вход",
  description: "Вход в личный кабинет по номеру телефона. Регистрация и пароль не нужны.",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string | string[] }>;
}

/**
 * Вход в личный кабинет: телефон → код → кабинет (PD-01).
 * `?next=` — куда вернуть после входа; принимается только адрес внутри сайта.
 */
export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;
  return <LoginView returnTo={safeReturnPath(typeof next === "string" ? next : null)} />;
}
