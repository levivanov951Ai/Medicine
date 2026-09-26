"use client";

import { useSyncExternalStore } from "react";

/**
 * Небольшое хранилище значения в sessionStorage с подпиской для React.
 * sessionStorage живёт только в этой вкладке и очищается при её закрытии —
 * подходит для черновика записи: переживает обновление страницы,
 * но не остаётся в браузере надолго.
 *
 * На сервере и при гидратации значение — null (getServerSnapshot),
 * поэтому разметка сервера и клиента совпадает.
 */
export interface SessionStore<T> {
  get(): T | null;
  set(value: T | null): void;
  update(fn: (current: T | null) => T | null): void;
  useValue(): T | null;
}

export function createSessionStore<T>(key: string): SessionStore<T> {
  let cachedRaw: string | null | undefined;
  let cachedValue: T | null = null;
  const listeners = new Set<() => void>();

  const read = (): T | null => {
    let raw: string | null = null;
    try {
      raw = window.sessionStorage.getItem(key);
    } catch {
      raw = null;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : null;
      } catch {
        cachedValue = null;
      }
    }
    return cachedValue;
  };

  const set = (value: T | null) => {
    try {
      if (value === null) window.sessionStorage.removeItem(key);
      else window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Хранилище недоступно — значение живёт до перезагрузки страницы.
      cachedRaw = value === null ? null : JSON.stringify(value);
      cachedValue = value;
    }
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    get: read,
    set,
    update: (fn) => set(fn(read())),
    useValue: () => useSyncExternalStore(subscribe, read, () => null),
  };
}
