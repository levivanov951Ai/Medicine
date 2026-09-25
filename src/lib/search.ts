/**
 * Поиск по каталогам: без учёта регистра и «ё», по всем словам запроса.
 * «узи брюшной» находит «УЗИ брюшной полости».
 */
export function normalizeSearchText(text: string): string {
  return text.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

/** Совпадает, если каждое слово запроса встречается хотя бы в одном из полей. */
export function matchesQuery(query: string, fields: Array<string | undefined>): boolean {
  const words = normalizeSearchText(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;
  const haystack = normalizeSearchText(fields.filter(Boolean).join(" "));
  return words.every((word) => haystack.includes(word));
}
