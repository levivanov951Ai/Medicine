import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Источник данных (mock | crm) — не секрет: нужен и серверному, и браузерному коду
  // (запись, вход и кабинет работают в браузере). См. src/services/config.ts.
  env: {
    DATA_SOURCE: process.env.DATA_SOURCE ?? "mock",
  },
};

export default nextConfig;
