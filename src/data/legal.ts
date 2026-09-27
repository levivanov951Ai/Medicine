/**
 * Правовые документы сайта — перечень из подвала Design v1.
 *
 * Тексты документов и юридическое название организации — UNKNOWN
 * (PROJECT_CONTEXT.md, 6.1 и PD-22). Сгенерированный текст как готовую
 * политику не публикуем: пока `content` = null, страница показывает,
 * что документ появится после предоставления клиникой.
 */
export interface LegalDocument {
  slug: string;
  title: string;
  /** Текст документа от клиники. `null` — ещё не предоставлен. */
  content: string | null;
}

export const legalDocuments: LegalDocument[] = [
  { slug: "privacy", title: "Политика конфиденциальности", content: null },
  { slug: "terms", title: "Пользовательское соглашение", content: null },
  { slug: "offer", title: "Публичная оферта", content: null },
];
