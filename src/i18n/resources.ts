import type en from './locales/en.json';
import enJson from './locales/en.json';
import ukJson from './locales/uk.json';

type Translation = typeof en;

enJson satisfies Translation;
ukJson satisfies Translation;

export const resources = {
  en: { translation: enJson },
  uk: { translation: ukJson },
} as const;

export type Language = keyof typeof resources;

export const supportedLanguages = Object.keys(resources) as Language[];
