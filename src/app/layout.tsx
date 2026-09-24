import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Начертания 400/500/600/700 — см. design/tokens.css, раздел «Типографика».
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Смлаб",
  description: "Медицинская клиника «Смлаб».",
};

// Пустой общий layout — без Header/Footer.
// Они добавляются отдельной задачей (docs/DEVELOPER_HANDOFF.md, раздел 3).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
