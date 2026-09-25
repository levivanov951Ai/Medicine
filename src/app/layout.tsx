import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
    title: {
      default: `${clinic.name} — запись к врачу и на анализы`,
      template: `%s — ${clinic.name}`,
    },
    description: "Запись к врачу и на анализы онлайн. Запись подтверждается сразу.",
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
