/**
 * Разбор параметров каталога из адреса: `?q=…&category=…`.
 * Неизвестное направление игнорируется — показывается весь каталог.
 */
export interface CatalogSearchParams {
  q?: string | string[];
  category?: string | string[];
}

export function parseCatalogParams(
  params: CatalogSearchParams,
  categoryIds: string[],
): { query: string; category: string | null } {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
  const category = first(params.category);
  return {
    query: first(params.q).trim(),
    category: categoryIds.includes(category) ? category : null,
  };
}
