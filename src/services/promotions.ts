import { clinicToday } from "@/lib/clinic-time";
import { routes } from "@/lib/routes";
import type { Promotion, PromotionTarget } from "@/types/catalog";
import { dataSource } from "./source";

/** Акция со ссылкой на то, к чему она относится. */
export interface PromotionItem {
  promotion: Promotion;
  /** `null` — связанной услуги / анализа / программы нет в каталоге: ссылку не показываем. */
  href: string | null;
  targetKind: PromotionTarget["kind"];
}

async function targetHref(target: PromotionTarget): Promise<string | null> {
  if (target.kind === "service") return (await dataSource.getServiceById(target.id)) ? routes.service(target.id) : null;
  if (target.kind === "analysis") return (await dataSource.getAnalysisById(target.id)) ? routes.analysis(target.id) : null;
  const packages = await dataSource.getLabPackages();
  return packages.some((item) => item.id === target.id) ? routes.labPackage(target.id) : null;
}

/**
 * Действующие акции — для главной и страницы «Акции».
 * Закончившиеся (дата окончания раньше сегодняшней) не показываются.
 * «Сегодня» — по календарю клиники (PD-30).
 */
export async function getActivePromotions(): Promise<PromotionItem[]> {
  const today = clinicToday();
  const promotions = (await dataSource.getPromotions()).filter(
    (promotion) => promotion.validUntil === null || promotion.validUntil >= today,
  );
  return Promise.all(
    promotions.map(async (promotion) => ({
      promotion,
      href: await targetHref(promotion.target),
      targetKind: promotion.target.kind,
    })),
  );
}
