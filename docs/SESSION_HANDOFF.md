# SESSION HANDOFF — СМЛаб

_2026-09-26. Правила работы — `CLAUDE.md`; прогресс — `docs/PROGRESS.md`; решения — `PROJECT_CONTEXT.md` и `docs/DEVELOPER_HANDOFF.md` (разделы 12–14)._

## Current state

Homepage, публичные каталоги и оба Booking flow полностью реализованы (frontend, MOCK-данные).

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

Заглушки: `/account`, `/login`, `/promo`, `/promo/[id]`, `/lab/packages`, `/about`, `/contacts`, `/legal/[slug]`.

## Important architecture

- **Canonical MOCK datasets** — `src/data/mock/`, одна запись на сущность (PD-25).
- **Selected analyses state** — `src/lib/selected-analyses.ts` (localStorage).
- **Booking state** — `src/lib/booking-draft.ts` (sessionStorage, `?draft=` в адресе).
- **Availability service** — `src/services/booking` (`bookingService`) → `src/data/mock/availability.ts`; «ближайшее время» — `src/services/availability.ts`.
- **Mock auth / OTP foundation** — `bookingService.sendOtp/verifyOtp`, код `11111`; `PhoneInput`, `OtpInput`; сессия пациента во вкладке — `mockPatientSession`. Демо-код виден только при `NEXT_PUBLIC_DEMO_MODE=true` (PD-26).
- **Service / data abstraction** — UI → `src/services/*` → `DataSource` (`source.ts`) / `bookingService` (`booking/index.ts`) → MOCK.

## Next task

Auth + Patient Account: Standalone Login, Shared Auth State, Booking/Auth integration, Authenticated Header, Account Dashboard, Appointment Details, Patient Profile, MOCK Appointment Persistence.

## Known production blockers

- Часовой пояс клиники — UNKNOWN.
- Реальный CRM / API — UNKNOWN.
- Реальный OTP/SMS-провайдер — UNKNOWN.
- Настоящая блокировка слотов требует backend / CRM.
