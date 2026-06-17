import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMMKVString } from 'react-native-mmkv';

import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

import type { Language } from '@/i18n/resources';
import { supportedLanguages } from '@/i18n/resources';

/**
 * Hook for managing the app language with MMKV persistence.
 *
 * RTL support is not enabled — no RTL languages are configured yet.
 * When adding an RTL language (e.g. Arabic, Hebrew), uncomment the RTL
 * logic in `src/i18n/index.ts` and restore direction switching here.
 * Direction changes require a JS reload; use `expo-updates` for OTA reload
 * or prompt the user to restart.
 *
 * @see https://docs.expo.dev/guides/localization/#forcing-rtl-layout
 */
export function useLanguage() {
  const { i18n } = useTranslation();
  const [, setStoredLanguage] = useMMKVString(STORAGE_KEYS.LANGUAGE, storage);

  const currentLanguage = i18n.language as Language;

  const changeLanguage = useCallback(
    (lng: Language) => {
      i18n.changeLanguage(lng);
      setStoredLanguage(lng);
    },
    [i18n, setStoredLanguage],
  );

  return { currentLanguage, changeLanguage, supportedLanguages };
}
