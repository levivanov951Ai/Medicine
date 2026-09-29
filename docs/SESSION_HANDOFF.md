# SESSION HANDOFF — СМЛаб

_2026-09-29. Правила работы — `CLAUDE.md`; прогресс — `docs/PROGRESS.md`; решения — `PROJECT_CONTEXT.md` и `docs/DEVELOPER_HANDOFF.md` (разделы 12–18); CRM — `docs/CRM_INTEGRATION.md`; запуск — `docs/PRODUCTION_READINESS.md`; staging — `docs/STAGING.md`; запрос контента у клиники — `docs/CONTENT_REQUIRED.md`._

## Current state

Весь frontend MVP реализован (MOCK-данные в браузере): главная, каталоги, запись, вход, кабинет с отменой и переносом, акции, «О клинике», «Контакты», правовые страницы, комплексные программы.

**STAGING READY:** https://smlab-staging.vercel.app (Vercel `lieon/smlab-staging`, MOCK, noindex, демо-код `11111`). Выкладка — вручную из CLI, git к Vercel не подключён (`docs/STAGING.md`). Production — BLOCKED.

## Current stack

Next.js App Router · TypeScript · Tailwind CSS v4 · React · канонические токены `design/tokens.css` · MOCK / service architecture.

## Completed routes

| Route | Что |
|---|---|
| `/` | Главная |
| `/services`, `/services/[id]` | Услуги и цены, страница услуги |
| `/doctors`, `/doctors/[id]` | Врачи, страница врача (с быстрыми слотами) |
| `/lab`, `/lab/[id]`, `/lab/selected` | Анализы, страница анализа, выбранные анализы |
| `/booking` | Запись к врачу (`?service`, `?doctor`, `?date&time`) |
| `/booking/lab` | Запись на анализы |
| `/login` | Вход по телефону и коду (`?next=` — возврат) |
| `/account` | Мои записи (только после входа) |
| `/account/appointments/[id]` | Детали записи |
| `/account/profile` | Профиль: имя, телефон, выход |
| `/account/appointments/[id]/reschedule` | Перенос записи |
| `/lab/packages` | Комплексные программы |
| `/promo` | Акции (страницы отдельной акции нет — PD-28) |
| `/about`, `/contacts` | О клинике, контакты |
| `/legal/[slug]` | `privacy`, `terms`, `offer` — тексты UNKNOWN |

Заглушек в навигации нет.

## Important architecture

- **Canonical MOCK datasets** — `src/data/mock/`, одна запись на сущность (PD-25).
- **Auth** — UI → `authSession` / `useAuth` (`src/lib/auth-session.ts`, единое состояние loading / guest / authenticated) → `authService` (`src/services/auth`) → MOCK в localStorage. Код `11111`; «Демо-код» только при `NEXT_PUBLIC_DEMO_MODE=true` (PD-26). OTP-интерфейс общий: `useOtpFlow` + `OtpCodeField`.
- **Patient** — `src/types/patient.ts`: id, name (может быть `null`), phoneDigits, createdAt. Без медицинских данных.
- **Appointment Store** — `src/types/appointment.ts` + `appointmentService` (`src/services/appointments`) → MOCK localStorage. Записи создаёт только `bookingService.createAppointment`; хранятся ссылки на каталог, цена и адрес — снимок. «Завершена» — по времени.
- **Отмена и перенос** — `appointmentService.getActions` (`canCancel`, `canReschedule`, `restrictionReason` — демо-правило, PRODUCTION RULE UNKNOWN), `appointmentService.cancel`, `bookingService.rescheduleAppointment`. Перенос — те же календарь, слоты, резерв 5 минут и подтверждение, что в записи. Подтверждение отмены — `Dialog` (модалка / нижний лист).
- **Route protection** — `AccountGuard` (`src/app/account/layout.tsx`): гость → `/login?next=…`. Только клиентская демонстрация.
- **Booking** — `bookingService` (`src/services/booking`) → `src/data/mock/availability.ts`; черновик — `src/lib/booking-draft.ts` (sessionStorage). Занятое время — из Appointment Store.
- **Selected analyses** — `src/lib/selected-analyses.ts` (localStorage). Комплексная программа (`LabPackage`, только `analysisIds`) добавляет в него свой состав без дублей.
- **Акции** — `src/services/promotions.ts`: действующие, со ссылкой на услугу / анализ / программу. **Правовые документы** — `src/data/legal.ts`. **Карта** — `MapPlaceholder`.
- **Переключение MOCK → CRM** — `DATA_SOURCE=mock|crm` (`src/services/config.ts`, `selectImplementation`); `crm` без реализации останавливает сборку.
- **Время клиники** — `Europe/Moscow` (PD-30) в `clinic.timezone`; «сейчас» — только через `clinicNow()` / `clinicToday()` (`src/lib/clinic-time.ts`), не `new Date()` с локальными геттерами. `dates.ts` — календарная арифметика без привязки к поясу.
- **Ошибки** — `ServiceError` + `serviceErrorMessage` (`src/services/errors.ts`); бизнес-исходы — `{ ok: false, reason }`.

## Next task

Обратная связь заказчика по staging. Параллельно ждём контент клиники, документацию и sandbox CRM, смс-провайдера, правила отмены/переноса, юридические документы и домен. CRM Integration — только с документацией; Production Launch — BLOCKED.

## Known production blockers

Полный список — `docs/PRODUCTION_READINESS.md`.


- Реальный CRM / API — UNKNOWN.
- Реальный OTP/SMS-провайдер — UNKNOWN.
- Серверная сессия и защита кабинета — нет (сейчас всё в браузере).
- Настоящая блокировка слотов требует backend / CRM.
- Сроки отмены и переноса — PRODUCTION RULE UNKNOWN.
- Скидочная цена комплексной программы (PD-29), юридические тексты, координаты для карты — UNKNOWN.
- Блок «Уведомления» в профиле — не в MVP (PD-27, PROJECT_CONTEXT.md): смс-провайдера нет, сроки напоминаний клиникой не подтверждены.
