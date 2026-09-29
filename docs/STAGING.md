# STAGING — СМЛаб

_Развёрнут 2026-09-29. Общая картина запуска — [`PRODUCTION_READINESS.md`](./PRODUCTION_READINESS.md)._

Закрытый демо-стенд для показа заказчику. Данные выдуманные (MOCK), CRM нет, вход по демо-коду. Не публиковать ссылку и не выдавать стенд за работающий сайт клиники.

## Адрес

**https://smlab-staging.vercel.app** — постоянная ссылка, открывается без входа в Vercel.

Адреса вида `smlab-staging-xxxx-lieon.vercel.app` — отдельные выкладки; по умолчанию закрыты входом в Vercel, заказчику их не отправлять.

## Vercel

| | |
|---|---|
| Проект | `lieon/smlab-staging` |
| Framework preset | **Next.js** (при создании через CLI стоял «Other» — сайт отдавал `NOT_FOUND`; исправлено в настройках проекта) |
| Node.js | 24.x |
| Git | к Vercel **не подключён**: выкладка только вручную из CLI, push в `main` ничего не выкладывает |
| Слот | основной слот проекта (в терминах Vercel — «Production»). Сам сайт при этом **staging**: это задаёт `NEXT_PUBLIC_SITE_ENV`, а не слот Vercel |
| Домен | только `*.vercel.app`, свой домен не подключён |

## Переменные окружения

Заданы для слотов Production и Preview проекта `smlab-staging`:

```
DATA_SOURCE=mock
NEXT_PUBLIC_SITE_ENV=staging
NEXT_PUBLIC_DEMO_MODE=true
```

- `NEXT_PUBLIC_SITE_URL` не задан: на staging sitemap пустой, а `metadataBase` Next.js на Vercel берёт из адреса выкладки.
- CRM-переменных нет и не нужно.
- Переменные встраиваются при сборке — после изменения нужна новая выкладка.

## Как выложить

Из корня проекта, после `npm run lint`, `npm run typecheck`, `npm run build`:

```bash
npx.cmd vercel deploy --prod --yes
```

- Выкладывается **текущее содержимое папки**, включая незакоммиченные изменения. Перед выкладкой проверить `git status`.
- `.env.local` и `.vercel/` создаёт Vercel CLI; оба уже в `.gitignore`. Если CLI снова допишет строки в `.gitignore` — вернуть файл (`git restore .gitignore`): его дописанное `.env*` перекрывает `!.env.example`.
- Вход в CLI — `npx.cmd vercel login` (делает владелец аккаунта).

## Smoke-check (2026-09-29 — пройден)

- [x] `/`, `/services`, `/doctors`, `/lab`, `/lab/packages`, `/promo`, `/about`, `/contacts`, `/login`, `/booking`, `/booking/lab`, `/account` — 200
- [x] `/services/nonexistent`, `/doctors/nonexistent`, `/lab/nonexistent`, `/legal/nonexistent` — 404
- [x] `/robots.txt` — `Disallow: /`; meta robots `noindex, nofollow`; заголовок `X-Robots-Tag: noindex, nofollow`
- [x] `/sitemap.xml` — пустой `urlset`
- [x] `/favicon.ico`, `/icon.svg`, `/apple-icon.png` — 200, все три в `<head>`
- [x] Заголовки: `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, `Strict-Transport-Security`; `X-Powered-By` нет
- [x] Гость → запись к врачу → демо-код `11111` → «Вы записаны» → кабинет
- [x] Запись на анализы (вошедший пациент — без повторного кода)
- [x] Кабинет: детали записи, перенос, отмена (окно подтверждения)
- [x] Выход → `/account` ведёт на `/login?next=/account` → код → кабинет, записи на месте
- [x] 320 / 390 / 1440 px — без горизонтальной прокрутки; мобильное меню открывается и закрывается
- [x] Консоль браузера — без ошибок гидратации и 404 ресурсов
- [x] Логи Vercel — без ошибок и ответов 5xx

## Известные ограничения staging

- Вход, пациенты и записи хранятся в браузере: у каждого проверяющего свои данные, между устройствами они не переносятся.
- CSP не включена (отложена, см. `PRODUCTION_READINESS.md`).

**Время.** Серверы Vercel работают в UTC, но «сегодня», «ближайшее время» и статусы записей считаются по часам клиники `Europe/Moscow` (PD-30). Первая выкладка отставала на 3 часа — исправлено и перепроверено 2026-09-29.
