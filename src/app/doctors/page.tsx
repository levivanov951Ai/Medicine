import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";

export const metadata: Metadata = { title: "Врачи" };

/** Временная заглушка — раздел ещё не реализован. */
export default function Page() {
  return <PlaceholderPage title="Врачи" />;
}
