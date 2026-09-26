import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Личный кабинет" };

/** Временная заглушка — личный кабинет реализуется на следующем этапе. */
export default function Page() {
  return <PlaceholderPage title="Личный кабинет" />;
}
