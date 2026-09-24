// Временная заглушка корневого маршрута.
// Реальная Homepage реализуется отдельной задачей (docs/DEVELOPER_HANDOFF.md).
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <p style={{ color: "var(--color-text-secondary)" }}>
        Технический foundation готов. Homepage ещё не реализована.
      </p>
    </main>
  );
}
