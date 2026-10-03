# CLAUDE.md — СМЛаб

Сайт медицинской клиники «СМЛаб». Текущее состояние — [`docs/PROGRESS.md`](docs/PROGRESS.md), сводка для новой сессии — [`docs/SESSION_HANDOFF.md`](docs/SESSION_HANDOFF.md).

## Источники истины

| Что | Где |
|---|---|
| Продуктовая логика, решения (PD-xx), статусы данных | [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) |
| Реализация UI | [`docs/DEVELOPER_HANDOFF.md`](docs/DEVELOPER_HANDOFF.md) |
| Токены — единственный канонический источник | [`design/tokens.css`](design/tokens.css) |
| Визуальный source of truth | Финальный Claude Design (Design v1) |
| Решения по доступности и контрасту | [`docs/CONTRAST_AUDIT.md`](docs/CONTRAST_AUDIT.md) |
| Подготовка к CRM: требования, вопросы, порядок | [`docs/CRM_INTEGRATION.md`](docs/CRM_INTEGRATION.md) |
| CRM «МедЦентр»: аудит, требования к API, план безопасности | [`docs/CRM_AUDIT.md`](docs/CRM_AUDIT.md), [`docs/CRM_API_REQUIREMENTS.md`](docs/CRM_API_REQUIREMENTS.md), [`docs/CRM_SECURITY_REMEDIATION.md`](docs/CRM_SECURITY_REMEDIATION.md) |
| Окружения, staging, блокеры запуска, чек-листы | [`docs/PRODUCTION_READINESS.md`](docs/PRODUCTION_READINESS.md) |
| Staging-стенд: адрес, Vercel, выкладка, smoke-check | [`docs/STAGING.md`](docs/STAGING.md) |
| Что запросить у клиники (для владельца, без техники) | [`docs/CONTENT_REQUIRED.md`](docs/CONTENT_REQUIRED.md) |

При конфликте — не угадывать, спросить пользователя.

## Стек

Next.js (App Router) · TypeScript · React · Tailwind CSS v4 · Inter (`next/font`).

## Архитектура

- Переиспользуемые компоненты: `src/components/ui`, `layout`, `features`.
- MOCK-данные отдельно от JSX: `src/data/mock/`. Факты о клинике: `src/data/clinic.ts`.
- Поток данных: **UI → `src/services/*` → реализация по `DATA_SOURCE`** (`mock` | `crm`, `src/services/config.ts`). Четыре сервиса: `dataSource`, `bookingService`, `authService`, `appointmentService`.
- CRM подключается позже. **Не придумывать API и схему CRM**, не создавать backend/БД. CRM клиники — «МедЦентр» (аудит — `docs/CRM_AUDIT.md`); API в ней нет, интеграция BLOCKED. Копию CRM не запускать, реальные данные пациентов в проект не копировать и не коммитить.
- Сбои источника данных — `ServiceError` (`src/services/errors.ts`), бизнес-исходы — `{ ok: false, reason }`. Сырые ответы CRM в компоненты не передавать.
- Секреты — только серверные переменные окружения, никогда `NEXT_PUBLIC_*`.
- Окружение — `NEXT_PUBLIC_SITE_ENV` (`src/lib/site-config.ts`): по умолчанию staging, сайт закрыт от индексации. Не ослаблять защиты от запуска production на MOCK или с демо-кодом. CSP отложена — не возвращать middleware с nonce и не ставить `'unsafe-inline'` ради галочки.
- Не использовать реальные данные пациентов.
- MOCK не выдавать за факты клиники; слово «MOCK» в UI не показывать. UNKNOWN — `null` и плейсхолдер, не выдумывать.
- В компонентах только semantic-токены. Primitive HEX в JSX/TSX/CSS не хардкодить, вторую палитру не создавать, примитивы без согласования не менять.
- Один MOCK-набор на сущность (PD-25): врачи, услуги, анализы, акции — в `src/data/mock/`, без версий под отдельные страницы.
- Время — по часам клиники `Europe/Moscow` (PD-30, `clinic.timezone`). «Сейчас» и «сегодня» — только `clinicNow()` / `clinicToday()` (`src/lib/clinic-time.ts`); не `new Date()` с локальными геттерами и не пояс браузера. Строку пояса и «+3» в коде не повторять.
- Выбранные анализы — `src/lib/selected-analyses.ts` (браузер, localStorage). С CRM не связаны.
- Запись: UI → `src/services/booking` (`bookingService`) → MOCK-расписание `src/data/mock/availability.ts`. Черновик записи — `src/lib/booking-draft.ts` (sessionStorage). Настоящих смс и CRM нет.
- Списки `/services`, `/doctors`, `/lab` и их `loading.tsx` лежат в route group `(catalog)`. Не поднимать `loading.tsx` выше: он накроет страницы деталей, и `notFound()` ответит HTTP 200 вместо 404.
- `cn()` не разрешает конфликты Tailwind-классов: не переопределять базовые классы компонента через `className`, а добавлять вариант (prop).

## Проверки после значимых изменений

```bash
npm run lint
npm run typecheck
npm run build
```

## Git

Никаких `git commit` и `git push` без отдельной команды пользователя.

## Общение

Пользователь — новичок. После крупной задачи кратко: 1) что сделано; 2) зачем; 3) проблемы; 4) следующий шаг. Без длинных лекций, если не просят.
