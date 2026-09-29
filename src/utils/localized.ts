import type { LocalizedText } from '@/types/api';

/** The text in the app language, English when that one's missing. */
export function localized(
  text: Partial<LocalizedText> | null | undefined,
  language: string,
): string {
  if (!text) return '';
  return text[language as keyof LocalizedText] || text.en || text.uk || '';
}
