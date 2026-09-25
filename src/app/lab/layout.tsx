import type { ReactNode } from "react";
import { SelectedAnalysesBar } from "@/components/features/analyses/SelectedAnalysesBar";
import { getAnalysesCatalog } from "@/services/analyses";

/**
 * Общая обёртка раздела «Анализы»: каталог, страница анализа, выбранные.
 * Панель выбранных анализов стоит последней, чтобы прилипать к низу экрана
 * в пределах раздела и не перекрывать подвал.
 */
export default async function LabLayout({ children }: { children: ReactNode }) {
  const { items } = await getAnalysesCatalog();

  return (
    <div>
      {children}
      <SelectedAnalysesBar catalog={items} />
    </div>
  );
}
