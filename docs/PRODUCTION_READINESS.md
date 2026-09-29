# PRODUCTION READINESS — СМЛаб

_2026-09-29. Что нужно клиенту — [`CONTENT_REQUIRED.md`](./CONTENT_REQUIRED.md). Интеграция с CRM — [`CRM_INTEGRATION.md`](./CRM_INTEGRATION.md). Staging-стенд — [`STAGING.md`](./STAGING.md)._

## Current status

**STAGING READY.**

| | Статус |
|---|---|
| Staging / demo deployment | ✅ **Развёрнут 2026-09-29** — https://smlab-staging.vercel.app (Vercel, MOCK, закрыт от индексации, smoke-check пройден) |
| Production launch | ⛔ **BLOCKED** — см. «Production blockers» |
| CRM Integration | ⏸ Ждёт документации CRM и тестового доступа |

---

## Environment model

| | Local | Staging | Production |
|---|---|---|---|
| `DATA_SOURCE` | `mock` | `mock` (явно) | **`crm` обязательно** |
| `NEXT_PUBLIC_SITE_ENV` | `staging` (по умолчанию) | `staging` | `production` |
| `NEXT_PUBLIC_DEMO_MODE` | можно `true` | по решению, явно | **запрещено** |
| Индексация | нет | нет | да (кроме кабинета, записи, входа) |
| Авторизация | MOCK в браузере | MOCK в браузере | серверная сессия, настоящий OTP |
| Контент | MOCK | MOCK | реальный от клиники |

**Тихого отката production → MOCK нет:** сборка и запуск останавливаются с понятной ошибкой, если
- `NEXT_PUBLIC_SITE_ENV=production` и `DATA_SOURCE=mock` (`src/services/config.ts`);
- `NEXT_PUBLIC_SITE_ENV=production` и `NEXT_PUBLIC_DEMO_MODE=true` (`src/lib/site-config.ts`);
- `DATA_SOURCE=crm`, но CRM-реализации нет, или значение неизвестно (`src/services/config.ts`).

Всё неизвестное или пустое в `NEXT_PUBLIC_SITE_ENV` считается staging — безопасное направление.

---

## Staging readiness

✅ Готово к staging:
- lint, typecheck, production build — без ошибок и предупреждений;
- все страницы и сценарии проходят на MOCK (запись к врачу и на анализы, вход, кабинет, перенос, отмена, выход/вход);
- staging закрыт от поисковиков тремя слоями (robots.txt, meta robots, `X-Robots-Tag`);
- security-заголовки, аварийные страницы ошибок, настоящие HTTP 404;
- нет секретов в репозитории и `.env` в истории git.

Staging — **внутренний демо-стенд**: данные выдуманные, код входа фиксированный. Ссылку на него не публиковать.

**Развёрнут 2026-09-29** на Vercel (`lieon/smlab-staging`): `DATA_SOURCE=mock`, `NEXT_PUBLIC_SITE_ENV=staging`, `NEXT_PUBLIC_DEMO_MODE=true`. Smoke-check по публичному адресу пройден полностью — список, процедура выкладки и ограничения в [`STAGING.md`](./STAGING.md).

Найдено на staging и исправлено 2026-09-29: серверные страницы считали «ближайшее время» по часам сервера (Vercel — UTC), время отставало на 3 часа. Теперь всё время — по часам клиники `Europe/Moscow` (PD-30), независимо от пояса сервера и браузера.

---

## Production blockers

| # | Блокер | Кто снимает |
|---|---|---|
| 1 | CRM: документация, тестовый доступ, реализация четырёх сервисов (`DATA_SOURCE=crm`) | владелец CRM → разработка |
| 2 | Настоящая авторизация: серверная сессия, OTP через смс-провайдера | клиника (провайдер) → разработка |
| 3 | Реальный резерв слота и защита от двойной записи — на стороне CRM/сервера | владелец CRM |
| 4 | ~~Часовой пояс клиники~~ — **закрыт 2026-09-29** (PD-30, `Europe/Moscow`) | — |
| 5 | Правила отмены и переноса (PRODUCTION RULE UNKNOWN, PD-06) | клиника / CRM |
| 6 | Реальный контент: услуги, врачи, цены, анализы, комплексы, акции, телефон, режим работы | клиника |
| 7 | Юридические документы и реквизиты | клиника |
| 8 | Домен (`NEXT_PUBLIC_SITE_URL`) | клиника |
| 9 | Content-Security-Policy (см. «Deferred CSP») | разработка, после п. 1 |

---

## Security status

**Действуют (все ответы, `next.config.ts`):**

| Заголовок | Значение | Зачем |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | браузер не угадывает тип файла |
| `X-Frame-Options` | `DENY` | сайт нельзя встроить в чужую страницу (защита от clickjacking) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | адреса страниц кабинета не утекают на сторонние сайты |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | запрет ненужных возможностей браузера |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | только HTTPS (по http браузер заголовок игнорирует) |
| `X-Robots-Tag` | `noindex, nofollow` — только вне production | второй слой запрета индексации |

`X-Powered-By` отключён (`poweredByHeader: false`).

**Аудит 2026-09-28:** секретов, ключей, `.env`-файлов в репозитории и истории нет; `console.*` в исходниках нет; в интерфейс не попадают тексты исключений, стек и ответы сервисов — только сообщения из `serviceErrorMessage` (`src/services/errors.ts`).

---

## Auth status

**Сейчас: только frontend MOCK.** Код `11111`, пациенты и сессия — в `localStorage` браузера. Защита кабинета (`AccountGuard`) — клиентская демонстрация, **не защита данных**.

Production требует (реализуется вместе с CRM, не раньше):
- серверная сессия;
- cookie `HttpOnly`, `Secure`, `SameSite=Lax` (или `Strict`);
- проверка доступа на сервере: patientId — из сессии, а не из запроса браузера;
- доступ к каждой записи — только её владельцу;
- настоящий OTP: отправка через смс-провайдера, срок жизни кода, лимит попыток и отправок;
- удалить `NEXT_PUBLIC_DEMO_MODE` и тестовый код (PD-26).

Backend не создавался: нет требований CRM и авторизации.

---

## CRM status

Документации нет. Граница подготовлена: `DATA_SOURCE`, контракты сервисов, модель ошибок, список вопросов — в [`CRM_INTEGRATION.md`](./CRM_INTEGRATION.md).

## Content status

Весь каталог, врачи, цены, комплексы и акции — MOCK (`src/data/mock/`). FACT: название, один филиал, адрес. Телефон и режим работы — UNKNOWN (placeholder). Список запроса — [`CONTENT_REQUIRED.md`](./CONTENT_REQUIRED.md).

## Legal status

`/legal/privacy`, `/legal/terms`, `/legal/offer` показывают «Документ будет опубликован после предоставления клиникой», закрыты от индексации и не входят в sitemap. Как только в `src/data/legal.ts` появится `content`, страница станет индексируемой и попадёт в sitemap автоматически. Согласия на обработку персональных данных в формах записи и входа пока нет — нужен текст от клиники.

---

## SEO/indexing

- **Root metadata** (`src/app/layout.tsx`): title с шаблоном `%s — СМЛаб`, description, `applicationName`, базовый Open Graph (`type`, `locale ru_RU`, `siteName`), `metadataBase` из `NEXT_PUBLIC_SITE_URL`. `og:title` и `og:description` страниц Next берёт из `<title>` и description. Картинки для соцсетей в Design v1 нет — не придумываем.
- **Заголовки страниц:** у услуги, врача, анализа — имя сущности; у записи в кабинете — «Запись» (данные в браузере, сервер их не знает).
- **noindex всегда:** кабинет, запись, вход, `/lab/selected`, правовые страницы без текста.
- **robots.txt:** staging — `Disallow: /`; production — закрыты `/account`, `/booking`, `/login`, указан sitemap.
- **sitemap.xml:** пуст, пока не production и не задан домен; в production — публичные страницы, услуги, врачи, анализы, правовые страницы с текстом.
- **Иконки:** `src/app/icon.svg` — утверждённый знак СМЛаб; `src/app/favicon.ico` (16/32/48 px) и `src/app/apple-icon.png` (180 px, белая подложка — iOS заливает прозрачность чёрным) — растровые версии того же знака, без изменений дизайна (2026-09-29). Next.js сам добавляет все три в `<head>`.

---

## Performance status

Аудит 2026-09-28:
- **JS:** все статические чанки ~1,1 МБ без сжатия, крупнейший ~232 КБ (runtime Next/React). Зависимостей всего 3 (`next`, `react`, `react-dom`).
- **Client Components:** 45; секции главной и каталоги — серверные, в браузере только интерактив (шапка, запись, кабинет, выбор анализов).
- **Двойные запросы — исправлено:** `generateMetadata` и страница вызывали один и тот же сервис дважды (услуга, врач, анализ, сведения о клинике). Теперь `React.cache()` — один вызов на серверный рендер; с CRM это вдвое меньше запросов.
- **Главная — dynamic, и это правильно:** «ближайшее время» и превью записи считаются от текущего момента, акции отсеиваются по дате. С CRM это живое расписание — статичная главная показывала бы устаревшие слоты. Решение о кешировании (revalidate) — после лимитов CRM.
- **Изображения:** единственное `<img>` — логотип (`next/image`, SVG, размеры заданы, `alt=""` при подписанной ссылке). Фото врачей и клиники — заглушки фиксированного размера, `aria-hidden`: сдвигов макета нет.
- **Шрифт:** Inter через `next/font` (latin + cyrillic, 400–700), самостоятельный хостинг, preload в заголовке `Link`. Внешних запросов нет.
- **Гидратация:** предупреждений в консоли нет.

---

## Accessibility status

Регрессия 2026-09-28 (браузер), маршруты `/`, `/services`, `/doctors/[id]`, `/lab`, `/booking`, `/login`, `/account`, `/account/appointments/[id]`, `/contacts`:
- ровно один H1, без пропусков уровней заголовков;
- landmarks: header, main, footer, nav;
- skip link виден при фокусе и переводит фокус в `main`;
- нет кнопок и ссылок без имени, полей без подписи, изображений без `alt`;
- мобильное меню и окно отмены: фокус внутри, Escape закрывает, фокус возвращается;
- сценарии A–F с клавиатуры и мышью проходят.

Раньше проверено и не менялось: контраст (`CONTRAST_AUDIT.md`), области нажатия ≥ 44×44, календарь, слоты, OTP, `aria-live`.

---

## Browser storage

Аудит 2026-09-28. **Не хранятся:** OTP-код, пароли, ключи, токены, диагнозы, медицинские документы, результаты анализов.

| Ключ | Хранилище | Что хранится | Зачем | Когда удаляется | Режим | Production |
|---|---|---|---|---|---|---|
| `smlab:selected-analyses` | local | id выбранных анализов | выбор между страницами | после записи на анализы, вручную | и MOCK, и production | остаётся (не персональные данные) |
| `smlab:booking:doctor` | session | шаг, услуга, врач, время, id резерва, **имя и телефон** | черновик записи переживает обновление | закрытие вкладки; имя и телефон — **при выходе** (исправлено 2026-09-28) | и MOCK, и production | остаётся; телефон — в сессии сервера |
| `smlab:booking:lab` | session | то же для анализов | то же | то же | и MOCK, и production | то же |
| `smlab:booking:reschedule` | session | id записи, новое время, id резерва | черновик переноса | закрытие вкладки, после переноса | и MOCK, и production | остаётся |
| `smlab:auth-session` | local | id пациента | «вход» в MOCK | выход | **только MOCK** | cookie `HttpOnly` на сервере |
| `smlab:mock-patients` | local | id, имя, телефон всех, кто входил в этом браузере | MOCK-«база» пациентов | не удаляется | **только MOCK** | пациенты в CRM |
| `smlab:mock-appointments` | local | записи: id, врач/услуга/анализы, дата, время, цена, адрес | MOCK-хранилище записей | не удаляется | **только MOCK** | записи в CRM |
| `smlab:mock-reservations` | session | резервы слотов | имитация резерва 5 минут | закрытие вкладки, истечение | **только MOCK** | резерв в CRM / на сервере |
| `smlab:mock-scenario` | session | имя тестового сценария | ручная проверка ошибок | вручную | **только MOCK** | удалить вместе с MOCK |

---

## Deferred CSP

Content-Security-Policy **отложена** — это production-hardening задача, не блокер staging.

Проверено 2026-09-27:
- строгая CSP в `next.config.ts` ломает встроенные инлайн-скрипты гидратации App Router — сайт не запускается;
- CSP на nonce через middleware работает только на динамических страницах: статически собранные (`/about`, `/contacts`, `/booking` …) остаются без nonce, и их скрипты блокируются.

Не делаем: все страницы dynamic только ради CSP; `'unsafe-inline'` / `'unsafe-eval'` для галочки.

CSP проектируется отдельно, когда известны: итоговая модель рендеринга, адреса CRM, провайдер карты, аналитика (если будет), другие внешние источники.

---

## Deployment prerequisites

- **Node.js ≥ 20.9** (требование Next.js 16; проверено на Node 24).
- **Установка:** `npm ci`
- **Сборка:** `npm run build`
- **Запуск:** `npm run start` (порт — `PORT` или `-p`, по умолчанию 3000)
- **Переменные** (см. `.env.example`) — задаются **до сборки**: `NEXT_PUBLIC_*` и `DATA_SOURCE` встраиваются в сборку. Смена значения требует пересборки.
- HTTPS на стороне хостинга / прокси.
- Staging — Vercel ([`STAGING.md`](./STAGING.md)). Хостинг production не выбран; код к провайдеру не привязан.

**Staging-конфигурация:**

```
DATA_SOURCE=mock
NEXT_PUBLIC_SITE_ENV=staging
NEXT_PUBLIC_SITE_URL=            # можно оставить пустым
NEXT_PUBLIC_DEMO_MODE=true       # только если стенд показывают клиенту; иначе false
```

---

## Staging checklist

Перед выкладкой:
- [ ] `npm run lint`, `npm run typecheck`, `npm run build` — без ошибок
- [ ] Переменные staging заданы до сборки
- [ ] Решено, показывать ли демо-код (`NEXT_PUBLIC_DEMO_MODE`)

Smoke-check после выкладки (2026-09-29 на https://smlab-staging.vercel.app — пройден, подробно в `STAGING.md`):
- [ ] `/` — 200, стили и логотип загрузились
- [ ] `/_next/static/...` — отдаются (нет 404 в консоли)
- [ ] `/robots.txt` — `Disallow: /`
- [ ] `/sitemap.xml` — пустой `urlset`
- [ ] Заголовок `X-Robots-Tag: noindex, nofollow` и meta robots `noindex` на главной
- [ ] Security-заголовки на месте (`curl -I`)
- [ ] `/services`, `/doctors`, `/lab`, `/lab/packages`, `/promo`, `/about`, `/contacts` — 200
- [ ] Запись к врачу: услуга → врач → время → код → «Вы записаны»
- [ ] Запись на анализы
- [ ] `/login` → код → кабинет; перенос и отмена записи
- [ ] `/services/nonexistent` — 404
- [ ] Консоль браузера без ошибок
- [ ] Логи сервера без ошибок
- [ ] Режим окружения: в `robots.txt` запрет — значит staging

---

## Production launch checklist

Всё из staging checklist, плюс:
- [ ] CRM-реализации всех четырёх сервисов, `DATA_SOURCE=crm`
- [ ] Серверная сессия, настоящий OTP, смс-провайдер
- [ ] Резерв слота и защита от двойной записи — в CRM / на сервере
- [x] Часовой пояс — `Europe/Moscow` (PD-30)
- [ ] Правила отмены и переноса — от клиники, в CRM
- [ ] Реальный контент, фото врачей
- [ ] Юридические документы, реквизиты, согласие на обработку данных в формах
- [ ] Домен, `NEXT_PUBLIC_SITE_URL`, HTTPS
- [ ] `NEXT_PUBLIC_SITE_ENV=production`, `NEXT_PUBLIC_DEMO_MODE` не задан
- [ ] MOCK-данные удалены или отключены, тестовый код удалён (PD-26)
- [ ] CSP спроектирована и включена
- [x] Растровые иконки (ICO / apple-touch-icon) — сделаны 2026-09-29
- [ ] `robots.txt` разрешает, `sitemap.xml` заполнен, проверка в Яндекс Вебмастере / Google Search Console
- [ ] Мониторинг ошибок (точка подключения — `serviceErrorMessage` / `toServiceError` в `src/services/errors.ts` и `app/error.tsx`, `app/global-error.tsx`); сторонний сервис сейчас не подключён

---

## Tests

Тестовой инфраструктуры в проекте нет, для этого этапа не устанавливалась. Рекомендация — лёгкий раннер (например, Vitest) для чистой логики: проверки окружения (`site-config.ts`, `services/config.ts`), переключения источника данных, перевода ошибок (`errors.ts`), статусов записи (`appointments/status.ts`), форматов телефона и дат.
