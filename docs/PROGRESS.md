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
- Cancel Appointment (окно подтверждения, запись остаётся в истории, время освобождается)
- Reschedule Appointment (`/account/appointments/[id]/reschedule`: новое время с резервом 5 минут)
- Promotions (`/promo`)
- About (`/about`)
- Contacts (`/contacts`, заглушка карты)
- Legal pages (`/legal/[slug]`, тексты — после предоставления клиникой)
- Lab Packages (`/lab/packages`, программа добавляет анализы в выбранные)
- Responsive- и accessibility-проверки, lint / typecheck / build

## Текущее состояние

Публичная часть сайта и личный кабинет готовы на desktop и mobile, заглушек в навигации нет.
Всё на MOCK: расписание, код подтверждения, пациенты и записи хранятся в браузере, CRM не подключена.
Правила отмены и переноса — демо (PRODUCTION RULE UNKNOWN). Защита кабинета — только клиентская демонстрация.
Короткая сводка для новой сессии — `docs/SESSION_HANDOFF.md`.

## Следующий этап — CRM Integration Preparation + CRM Integration

## Позже

- Production hardening
