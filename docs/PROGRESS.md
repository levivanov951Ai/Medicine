# PROGRESS — СМЛаб

_Обновлено: 2026-09-25_

## Завершено

- Product / UX документация (`PROJECT_CONTEXT.md`, sitemap, flows)
- Design v1
- Канонические токены (`design/tokens.css`)
- Контраст-аудит (`docs/CONTRAST_AUDIT.md`)
- Next.js foundation
- Переиспользуемые компоненты Homepage
- Header
- Mobile Navigation
- Footer
- MOCK / service layer
- Homepage desktop / mobile
- Responsive-проверка
- Accessibility-проверка
- lint / typecheck / build
- Services Catalog (`/services`, поиск `?q=`, направления `?category=`)
- Service Details (`/services/[id]`)
- Doctors Catalog (`/doctors`)
- Doctor Details (`/doctors/[id]`)
- Analyses Catalog (`/lab`)
- Analysis Details (`/lab/[id]`)
- Selected Analyses (`/lab/selected`, выбор сохраняется в браузере)

## Текущее состояние

Главная и публичный каталог реализованы и работают на desktop и mobile.
Решения и открытые вопросы этапа — `docs/DEVELOPER_HANDOFF.md`, раздел 13.

## Следующий этап

- Booking flow: запись к врачу (`/booking`) и запись на анализы (`/booking/lab`)

## Позже

- Auth
- Account
- Комплексы анализов (`/lab/packages`), акции, вторичные страницы
- Интеграция с CRM
- Production-тестирование и деплой
