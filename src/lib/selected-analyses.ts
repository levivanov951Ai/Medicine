"use client";

import { useSyncExternalStore } from "react";

/**
 * Выбранные анализы (PD-04) — простое клиентское состояние без библиотек.
 *
 * Хранятся только id анализов: цены и названия всегда берутся из каталога,
 * поэтому устаревшие данные в браузере не могут показать неверную цену.
 * Список сохраняется в localStorage — переживает переходы между страницами
 * и обновление страницы, синхронизируется между вкладками.
 *
 * SSR и гидратация: на сервере и при гидратации список пуст
 * (getServerSnapshot), сразу после — подставляется сохранённый.
 * Разметка сервера и клиента поэтому совпадает.
 *
 * С CRM не связано: это черновик пользователя до записи.
 */

const STORAGE_KEY = "smlab:selected-analyses";
const EMPTY: readonly string[] = Object.freeze([]);

let cache: readonly string[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): readonly string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed)) {
      return Object.freeze([...new Set(parsed.filter((id): id is string => typeof id === "string"))]);
    }
  } catch {
    // Повреждённое значение или недоступное хранилище — начинаем с пустого списка.
  }
  return EMPTY;
}

function getSnapshot(): readonly string[] {
  if (cache === null) cache = readStorage();
  return cache;
}

function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

function write(next: readonly string[]) {
  cache = Object.freeze([...next]);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Приватный режим или переполнение — выбор работает до закрытия вкладки.
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== STORAGE_KEY) return;
  cache = readStorage();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const selectedAnalyses = {
  add(id: string) {
    const current = getSnapshot();
    if (!current.includes(id)) write([...current, id]);
  },
  remove(id: string) {
    const current = getSnapshot();
    if (current.includes(id)) write(current.filter((item) => item !== id));
  },
  toggle(id: string) {
    if (getSnapshot().includes(id)) selectedAnalyses.remove(id);
    else selectedAnalyses.add(id);
  },
  clear() {
    if (getSnapshot().length > 0) write([]);
  },
};

/** id выбранных анализов в порядке добавления. */
export function useSelectedAnalysisIds(): readonly string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const noopSubscribe = () => () => {};

/** false — до гидратации (сохранённый выбор ещё не прочитан). */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
