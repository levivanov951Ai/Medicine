"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { matchesQuery } from "./search";

interface CatalogFiltersOptions<T> {
  items: T[];
  initialQuery: string;
  initialCategory: string | null;
  /** Сколько элементов показывать за раз («Показать ещё» добавляет столько же). */
  pageSize: number;
  getCategoryIds: (item: T) => string[];
  getSearchFields: (item: T) => Array<string | undefined>;
}

/**
 * Состояние каталога: поисковый запрос, направление, «Показать ещё».
 *
 * Фильтрация — на клиенте, мгновенно. Запрос и направление синхронизируются
 * с адресом (`?q=…&category=…`) через history.replaceState: ссылкой можно
 * поделиться, после обновления страницы фильтр сохраняется, а история
 * браузера не засоряется каждым нажатием клавиши.
 *
 * При подключении CRM с тысячами позиций фильтрацию можно перенести
 * на сервер — формат адреса останется тем же.
 */
export function useCatalogFilters<T>({
  items,
  initialQuery,
  initialCategory,
  pageSize,
  getCategoryIds,
  getSearchFields,
}: CatalogFiltersOptions<T>) {
  const pathname = usePathname();
  const [query, setQueryState] = useState(initialQuery);
  const [category, setCategoryState] = useState(initialCategory);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trimmed = query.trim();
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    if (category) params.set("category", category);
    else params.delete("category");
    const search = params.toString();
    const next = search ? `${pathname}?${search}` : pathname;
    if (next !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, "", next);
    }
  }, [query, category, pathname]);

  // Совпадения по запросу — для счётчиков направлений.
  const matches = useMemo(
    () => items.filter((item) => matchesQuery(query, getSearchFields(item))),
    [items, query, getSearchFields],
  );

  const counts = useMemo(() => {
    const result = new Map<string, number>();
    for (const item of matches) {
      for (const id of getCategoryIds(item)) result.set(id, (result.get(id) ?? 0) + 1);
    }
    return result;
  }, [matches, getCategoryIds]);

  const results = useMemo(
    () => (category ? matches.filter((item) => getCategoryIds(item).includes(category)) : matches),
    [matches, category, getCategoryIds],
  );

  const visible = results.slice(0, pages * pageSize);

  return {
    query,
    category,
    setQuery: (value: string) => {
      setQueryState(value);
      setPages(1);
    },
    setCategory: (value: string | null) => {
      setCategoryState(value);
      setPages(1);
    },
    reset: () => {
      setQueryState("");
      setCategoryState(null);
      setPages(1);
    },
    matchesCount: matches.length,
    counts,
    results,
    visible,
    hasMore: visible.length < results.length,
    showMore: () => setPages((value) => value + 1),
  };
}
