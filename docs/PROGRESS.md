# PROGRESS — СМЛаб

_Обновлено: 2026-09-29_

**Статус: STAGING READY** — https://smlab-staging.vercel.app · Production — **BLOCKED**

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
- CRM Integration Preparation (аудит, требования и вопросы — `docs/CRM_INTEGRATION.md`; переключатель `DATA_SOURCE`; модель ошибок; настоящий 404)
- Production Readiness Preparation (окружения staging/production, noindex, robots/sitemap, security-заголовки, защиты от запуска на MOCK, аудиты — `docs/PRODUCTION_READINESS.md`; запрос контента — `docs/CONTENT_REQUIRED.md`)
- Staging Deployment (Vercel `smlab-staging`, MOCK, noindex, демо-код; растровые иконки; smoke-check по публичному адресу пройден — `docs/STAGING.md`)
- Clinic Timezone (PD-30: `Europe/Moscow`; время клиники на сервере и в браузере)
- Responsive- и accessibility-проверки, lint / typecheck / build

## Текущее состояние

Публичная часть сайта и личный кабинет готовы на desktop и mobile, заглушек в навигации нет.
Всё на MOCK: расписание, код подтверждения, пациенты и записи хранятся в браузере, CRM не подключена.
Правила отмены и переноса — демо (PRODUCTION RULE UNKNOWN). Защита кабинета — только клиентская демонстрация.
Короткая сводка для новой сессии — `docs/SESSION_HANDOFF.md`.

## Следующий шаг

Показать стенд заказчику и собрать обратную связь. Новые функции — только по ней.

## WAITING FOR

- реальный контент клиники (`docs/CONTENT_REQUIRED.md`);
- документация CRM;
- тестовый доступ к CRM (sandbox);
- решение по смс-провайдеру;
- правила отмены и переноса для production;
- юридические документы;
- домен для production.

## Потом

- CRM Integration — после документации CRM (`docs/CRM_INTEGRATION.md`)
- Production Launch — **BLOCKED** (блокеры — `docs/PRODUCTION_READINESS.md`)
