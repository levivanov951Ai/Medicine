# CLAUDE.md — СМЛаб

Сайт медицинской клиники «СМЛаб». Текущее состояние — [`docs/PROGRESS.md`](docs/PROGRESS.md).

## Источники истины

| Что | Где |
|---|---|
| Продуктовая логика, решения (PD-xx), статусы данных | [`PROJECT_CONTEXT.md`](PROJECT_CONTEXT.md) |
| Реализация UI | [`docs/DEVELOPER_HANDOFF.md`](docs/DEVELOPER_HANDOFF.md) |
| Токены — единственный канонический источник | [`design/tokens.css`](design/tokens.css) |
| Визуальный source of truth | Финальный Claude Design (Design v1) |
| Решения по доступности и контрасту | [`docs/CONTRAST_AUDIT.md`](docs/CONTRAST_AUDIT.md) |

При конфликте — не угадывать, спросить пользователя.

## Стек

Next.js (App Router) · TypeScript · React · Tailwind CSS v4 · Inter (`next/font`).

## Архитектура

- Переиспользуемые компоненты: `src/components/ui`, `layout`, `features`.
- MOCK-данные отдельно от JSX: `src/data/mock/`. Факты о клинике: `src/data/clinic.ts`.
- Поток данных: **UI → `src/services/*` → `DataSource` → источник данных**. Переключение MOCK → CRM — `src/services/source.ts`.
- CRM подключается позже. **Не придумывать API и схему CRM**, не создавать backend/БД.
- Не использовать реальные данные пациентов.
- MOCK не выдавать за факты клиники; слово «MOCK» в UI не показывать. UNKNOWN — `null` и плейсхолдер, не выдумывать.
- В компонентах только semantic-токены. Primitive HEX в JSX/TSX/CSS не хардкодить, вторую палитру не создавать, примитивы без согласования не менять.
- Врачи — единый набор `src/data/mock/doctors.ts` (PD-25).

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
