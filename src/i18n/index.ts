import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Platform } from 'react-native';

import { storage } from '@/utils/storage';

import { STORAGE_KEYS } from '@/constants';

import { type Language, resources, supportedLanguages } from './resources';

export function isSupportedLanguage(code: string): code is Language {
  return (supportedLanguages as string[]).includes(code);
}

function resolveLanguage(): Language {
  const saved = storage.getString(STORAGE_KEYS.LANGUAGE);
  if (saved && isSupportedLanguage(saved)) return saved;

  const device = getLocales()[0]?.languageCode;
  if (device && isSupportedLanguage(device)) return device;

  return 'en';
}

// eslint-disable-next-line import/no-named-as-default-member -- i18next singleton API
i18n.use(initReactI18next).init({
  resources,
  lng: resolveLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

/**
 * Sync layout direction with the resolved language on every JS bundle load.
 *
 * `extra.supportsRTL` in app.config.ts only handles RTL based on the device's
 * system locale. When the user picks an RTL language inside the app (e.g. AR)
 * while the device is set to LTR (e.g. EN), we must call forceRTL manually so
 * the correct direction is applied at startup — not just when the user switches.
 *
 * On RN ≥ 0.79, forceRTL takes effect on the current JS load without a full
 * native restart, so a JS-only reload (e.g. via expo-updates) is sufficient.
 */
if (Platform.OS !== 'web') {
  // eslint-disable-next-line import/no-named-as-default-member -- calling instance method, not named export
  const shouldBeRTL = i18n.dir() === 'rtl';
  I18nManager.allowRTL(shouldBeRTL);
  I18nManager.forceRTL(shouldBeRTL);
}

export default i18n;
