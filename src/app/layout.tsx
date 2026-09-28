import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { indexingAllowed, siteUrl } from "@/lib/site-config";
import { getClinicInfo } from "@/services/clinic";
import "./globals.css";

// Начертания 400/500/600/700 — см. design/tokens.css, раздел «Типографика».
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const clinic = await getClinicInfo();
  return {
    // UNKNOWN, пока не назначен домен (docs/CRM_INTEGRATION.md, раздел 14).
    // Без него Next не может строить абсолютные OG/canonical адреса — это ок,
    // просто не строит; сайт работает и без назначенного домена.
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: `${clinic.name} — запись к врачу и на анализы`,
      template: `%s — ${clinic.name}`,
    },
    description: "Запись к врачу и на анализы онлайн. Запись подтверждается сразу.",
    applicationName: clinic.name,
    // Базовый Open Graph: только проверенные сведения (display brand — PD-22).
    // Картинки для соцсетей нет в Design v1 — не придумываем; og:title
    // и og:description страниц соцсети берут из <title> и description.
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: clinic.name,
    },
    // Staging/demo по умолчанию — сайт не индексируется (site-config.ts).
    // Страницы, которые не индексируются и в production (кабинет, запись,
    // вход, юридические заглушки), сами задают robots — этот дефолт не трогают.
    robots: indexingAllowed ? undefined : { index: false, follow: false },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clinic = await getClinicInfo();

  return (
    <html lang="ru" className={inter.variable}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-(--radius-m) bg-(--color-surface-card) px-4 py-3 font-semibold text-(--color-text-link-strong) shadow-(--shadow-l) focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50"
        >
          Перейти к содержимому
        </a>
        <SiteHeader clinic={clinic} />
        <main id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter clinic={clinic} />
      </body>
    </html>
  );
}
