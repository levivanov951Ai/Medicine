/**
 * Единая модель ошибок источника данных.
 *
 * Два вида неуспеха — не путать:
 * 1. Ожидаемый бизнес-исход («время заняли», «резерв истёк», «неверный код»)
 *    возвращается в результате операции: `{ ok: false, reason }`.
 * 2. Сбой инфраструктуры (нет сети, CRM не ответила, нет доступа) —
 *    исключение ServiceError с кодом из списка ниже.
 *
 * Будущий CRM-адаптер переводит ответы CRM (HTTP-статусы, коды ошибок) в эти
 * коды в одном месте. Компоненты сырой ответ CRM не получают никогда.
 */
export type ServiceErrorCode =
  | "network" // нет соединения, таймаут
  | "unauthorized" // сессия истекла или нет доступа
  | "not-found" // сущности нет
  | "validation" // данные не приняты (формат, обязательные поля)
  | "slot-conflict" // время уже занято другим пациентом
  | "unavailable" // сервис временно недоступен, технические работы
  | "server"; // любая другая ошибка источника данных

export class ServiceError extends Error {
  readonly code: ServiceErrorCode;

  constructor(code: ServiceErrorCode, message?: string, options?: { cause?: unknown }) {
    super(message ?? code, options);
    this.name = "ServiceError";
    this.code = code;
  }
}

/** Любое исключение → ServiceError. Неизвестное считается ошибкой сервера. */
export function toServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceError) return error;
  // fetch бросает TypeError, когда нет сети или сервер недоступен.
  if (error instanceof TypeError) return new ServiceError("network", error.message, { cause: error });
  return new ServiceError("server", error instanceof Error ? error.message : undefined, { cause: error });
}

/** Текст для пациента — без технических подробностей. */
export function serviceErrorMessage(error: unknown): string {
  switch (toServiceError(error).code) {
    case "network":
      return "Нет соединения. Проверьте интернет и попробуйте ещё раз.";
    case "unauthorized":
      return "Сессия закончилась. Войдите снова по номеру телефона.";
    case "not-found":
      return "Не нашли нужные данные — возможно, они изменились.";
    case "validation":
      return "Проверьте введённые данные и попробуйте ещё раз.";
    case "slot-conflict":
      return "Это время только что заняли. Выберите другое.";
    case "unavailable":
      return "Сервис временно недоступен. Попробуйте чуть позже.";
    default:
      return "Что-то пошло не так. Попробуйте ещё раз.";
  }
}
