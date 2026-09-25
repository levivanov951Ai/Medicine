import type { Analysis, Category } from "@/types/catalog";
import { dataSource } from "./source";

/** Анализ с подписью раздела — строка каталога и выбранных анализов. */
export interface AnalysisListItem {
  analysis: Analysis;
  categoryLabel: string;
}

export interface AnalysesCatalogData {
  /** Только разделы, в которых есть анализы. */
  categories: Category[];
  items: AnalysisListItem[];
}

export interface AnalysisPageData {
  analysis: Analysis;
  category: Category | null;
  related: AnalysisListItem[];
}

function toListItems(analyses: Analysis[], categories: Category[]): AnalysisListItem[] {
  const labels = new Map(categories.map((category) => [category.id, category.label]));
  return analyses.map((analysis) => ({
    analysis,
    categoryLabel: labels.get(analysis.categoryId) ?? "",
  }));
}

/** Каталог «Анализы»: порядок — по разделам, внутри — как в источнике. */
export async function getAnalysesCatalog(): Promise<AnalysesCatalogData> {
  const [categories, analyses] = await Promise.all([
    dataSource.getAnalysisCategories(),
    dataSource.getAnalyses(),
  ]);
  const order = new Map(categories.map((category, index) => [category.id, index]));
  const sorted = [...analyses].sort(
    (a, b) => (order.get(a.categoryId) ?? Infinity) - (order.get(b.categoryId) ?? Infinity),
  );
  return {
    categories: categories.filter((category) => analyses.some((a) => a.categoryId === category.id)),
    items: toListItems(sorted, categories),
  };
}

/** Страница анализа. `null` — анализа нет (страница отвечает 404). */
export async function getAnalysisPage(id: string): Promise<AnalysisPageData | null> {
  const analysis = await dataSource.getAnalysisById(id);
  if (!analysis) return null;

  const [categories, analyses] = await Promise.all([
    dataSource.getAnalysisCategories(),
    dataSource.getAnalyses(),
  ]);

  const related = (analysis.relatedAnalysisIds ?? [])
    .map((relatedId) => analyses.find((item) => item.id === relatedId))
    .filter((item): item is Analysis => item !== undefined);

  return {
    analysis,
    category: categories.find((category) => category.id === analysis.categoryId) ?? null,
    related: toListItems(related, categories),
  };
}
