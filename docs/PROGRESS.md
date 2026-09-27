# PROGRESS — СМЛаб

_Обновлено: 2026-09-27_

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
- Standalone Auth (`/login`: телефон → код → кабинет, возврат по `?next=`)
- Shared Auth State (один вход для записи, шапки и кабинета)
- Booking/Auth Integration (код в записи = вход на сайт; повторно код не спрашивается)
- Authenticated Header (desktop и мобильное меню)
- Account Dashboard (`/account`)
- Appointment Details (`/account/appointments/[id]`)
- Patient Profile (`/account/profile`)
- MOCK Appointment Persistence (записи переживают обновление, выход и повторный вход)
- Responsive- и accessibility-проверки, lint / typecheck / build

## Текущее состояние

Главная, публичные каталоги, обе записи, вход и личный кабинет работают на desktop и mobile.
Всё на MOCK: расписание, код подтверждения, пациенты и записи хранятся в браузере, CRM не подключена.
Защита кабинета — только клиентская демонстрация.
Короткая сводка для новой сессии — `docs/SESSION_HANDOFF.md`.

## Следующий этап — Appointment Management + Secondary Pages

- Отмена записи (Cancel appointment)
- Перенос записи (Reschedule appointment)
- Акции (Promotions)
- Контакты (Contacts)
- О клинике (About)
- Правовые страницы — шаблоны (legal templates)
- Комплексы анализов / Check-ups — при необходимости

## Позже

- Интеграция с CRM
- Production hardening
