"use client";

/**
 * Аварийная граница уровня приложения — ловит ошибки, которые падают
 * ещё в `layout.tsx` (например, `getClinicInfo()` не ответил). В таком
 * случае обычный `error.tsx` не сработает: он сам вложен в layout.
 *
 * Next.js требует, чтобы `global-error.tsx` рисовал собственные `<html>`
 * и `<body>` — родительский layout в этот момент недоступен. Поэтому здесь
 * нет общих компонентов сайта и Tailwind-классов: они могут быть недогружены
 * в момент фатального сбоя. Только простая инлайновая разметка.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", color: "#0F1B24", background: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "96px auto", padding: "0 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 12px" }}>Не удалось загрузить сайт</h1>
          <p style={{ fontSize: 16, lineHeight: 1.5, color: "#4A5A66", margin: "0 0 24px" }}>
            Проверьте интернет-соединение и попробуйте ещё раз.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              height: 44,
              padding: "0 20px",
              borderRadius: 12,
              border: "1.5px solid #1E7BA6",
              background: "#fff",
              color: "#1E7BA6",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Обновить
          </button>
        </div>
      </body>
    </html>
  );
}
