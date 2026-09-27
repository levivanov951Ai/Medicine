# SESSION HANDOFF — СМЛаб

_2026-09-27. Правила работы — `CLAUDE.md`; прогресс — `docs/PROGRESS.md`; решения — `PROJECT_CONTEXT.md` и `docs/DEVELOPER_HANDOFF.md` (разделы 12–15)._

## Current state

Homepage, публичные каталоги, оба Booking flow, вход и личный кабинет реализованы (frontend, MOCK-данные в браузере).

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

Заглушки: `/promo`, `/promo/[id]`, `/lab/packages`, `/about`, `/contacts`, `/legal/[slug]`.

## Important architecture

- **Canonical MOCK datasets** — `src/data/mock/`, одна запись на сущность (PD-25).
- **Auth** — UI → `authSession` / `useAuth` (`src/lib/auth-session.ts`, единое состояние loading / guest / authenticated) → `authService` (`src/services/auth`) → MOCK в localStorage. Код `11111`; «Демо-код» только при `NEXT_PUBLIC_DEMO_MODE=true` (PD-26). OTP-интерфейс общий: `useOtpFlow` + `OtpCodeField`.
- **Patient** — `src/types/patient.ts`: id, name (может быть `null`), phoneDigits, createdAt. Без медицинских данных.
- **Appointment Store** — `src/types/appointment.ts` + `appointmentService` (`src/services/appointments`) → MOCK localStorage. Записи создаёт только `bookingService.createAppointment`; хранятся ссылки на каталог, цена и адрес — снимок. «Завершена» — по времени.
- **Route protection** — `AccountGuard` (`src/app/account/layout.tsx`): гость → `/login?next=…`. Только клиентская демонстрация.
- **Booking** — `bookingService` (`src/services/booking`) → `src/data/mock/availability.ts`; черновик — `src/lib/booking-draft.ts` (sessionStorage). Занятое время — из Appointment Store.
- **Selected analyses** — `src/lib/selected-analyses.ts` (localStorage).
- Переключение MOCK → CRM: `source.ts`, `booking/index.ts`, `auth/index.ts`, `appointments/index.ts` — по одной строке.

## Next task

Appointment Management + Secondary Pages: отмена и перенос записи (кнопки и места в UI уже есть), акции, контакты, о клинике, правовые шаблоны, при необходимости — комплексы анализов. После — CRM Integration.

## Known production blockers

- Часовой пояс клиники — UNKNOWN.
- Реальный CRM / API — UNKNOWN.
- Реальный OTP/SMS-провайдер — UNKNOWN.
- Серверная сессия и защита кабинета — нет (сейчас всё в браузере).
- Настоящая блокировка слотов требует backend / CRM.
- Блок «Уведомления» в профиле — не в MVP (PD-27, PROJECT_CONTEXT.md): смс-провайдера нет, сроки напоминаний клиникой не подтверждены.
