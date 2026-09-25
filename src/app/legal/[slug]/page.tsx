import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { legalNav } from "@/lib/navigation";

/** Только известные правовые страницы; остальные адреса — 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return legalNav.map((item) => ({ slug: item.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

function findPage(slug: string) {
  return legalNav.find((item) => item.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPage((await params).slug);
  return { title: page?.label };
}

/** Временная заглушка. Юридическая информация — UNKNOWN (PROJECT_CONTEXT.md). */
export default async function LegalPage({ params }: Props) {
  const page = findPage((await params).slug);
  if (!page) notFound();
  return <PlaceholderPage title={page.label} />;
}
