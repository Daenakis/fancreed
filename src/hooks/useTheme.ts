import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

import { storage } from '@/utils/storage';

import type { ThemeName, ThemePreference } from '@/types';

import { STORAGE_KEYS } from '@/constants';

const themePreferences: ThemePreference[] = ['system', 'light', 'dark'];

function isThemePreference(value: unknown): value is ThemePreference {
  return themePreferences.includes(value as ThemePreference);
}

/**
 * Theme state and the user's theme preference (persisted in MMKV).
 *
 * - `currentTheme` — the theme actually shown ('light' | 'dark')
 * - `preference` — what the user picked ('system' | 'light' | 'dark')
 */
export function useTheme() {
  const { theme, rt } = useUnistyles();
  const [storedPreference, setStoredPreference] = useMMKVString(
    STORAGE_KEYS.THEME,
    storage,
  );

  const currentTheme = rt.themeName as ThemeName;
  const preference: ThemePreference = isThemePreference(storedPreference)
    ? storedPreference
    : 'system';

  const setPreference = useCallback(
    (next: ThemePreference) => {
      if (next === 'system') {
        UnistylesRuntime.setAdaptiveThemes(true);
      } else {
        UnistylesRuntime.setAdaptiveThemes(false);
        UnistylesRuntime.setTheme(next);
      }
      setStoredPreference(next);
    },
    [setStoredPreference],
  );

  return { theme, currentTheme, preference, themePreferences, setPreference };
}
