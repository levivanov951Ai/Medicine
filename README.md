# Смлаб — frontend

Next.js (App Router) + TypeScript + Tailwind CSS.

## Запуск

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Проектная документация

Технический foundation — не источник истины по продукту и дизайну. Перед разработкой см.:

- [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) — продукт, факты о клинике, продуктовые решения
- [`docs/DEVELOPER_HANDOFF.md`](./docs/DEVELOPER_HANDOFF.md) — задание на реализацию, карта экранов
- [`docs/CONTRAST_AUDIT.md`](./docs/CONTRAST_AUDIT.md) — аудит контраста
- [`design/tokens.css`](./design/tokens.css) — канонические design tokens

## Структура

```
src/
  app/                  маршруты (Next.js App Router)
  components/
    ui/                 базовые переиспользуемые компоненты (Button, Input, Badge...)
    layout/             Header, Footer, обёртки страниц
    features/           компоненты, специфичные для доменной логики (Booking, каталоги...)
  data/                 mock-данные (изолированы, удаляются при подключении CRM)
  services/             обращения к данным / будущему API
  types/                общие TypeScript-типы
  lib/                  вспомогательные функции, не привязанные к React
design/
  tokens.css            канонический источник design tokens
docs/                   документация по реализации и аудиту
```

## Скрипты

| Команда | Что делает |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Продакшн-сборка |
| `npm run lint` | Проверка ESLint |
| `npm run typecheck` | Проверка типов TypeScript без сборки |
