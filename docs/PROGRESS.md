# PROGRESS — СМЛаб

_Обновлено: 2026-09-26_

## Завершено

- Product / UX документация, Design v1, канонические токены, контраст-аудит
- Next.js foundation, Header, Mobile Navigation, Footer
- MOCK / service layer
- Homepage (desktop / mobile)
- Services Catalog, Service Details
- Doctors Catalog, Doctor Details
- Analyses Catalog, Analysis Details, Selected Analyses
- Doctor Booking
- Lab Booking
- Calendar
- Time Slots
- Reservation Timer
- MOCK OTP inside booking
- Booking Confirmation
- Booking Success
- Doctor Quick Slots
- MOCK availability / service layer
- Responsive- и accessibility-проверки, lint / typecheck / build

## Текущее состояние

Главная, публичные каталоги и обе записи работают на desktop и mobile.
Запись — на MOCK: расписание, резерв и код подтверждения имитируются в браузере, CRM не подключена.
Короткая сводка для новой сессии — `docs/SESSION_HANDOFF.md`.

## Следующий этап — Auth + Patient Account

- Standalone Login (`/login`: телефон → код)
- Shared Auth State (общий для входа и записи)
- Booking/Auth integration
- Authenticated Header
- Account Dashboard (`/account`)
- Appointment Details
- Patient Profile
- MOCK Appointment Persistence (созданные записи видны в кабинете)

## Позже

- Отмена и перенос записи
- Вторичные страницы (акции, комплексы анализов, о клинике, контакты, правовые)
- Интеграция с CRM
- Production hardening
