import { useCallback } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { UnistylesRuntime, useUnistyles } from 'react-native-unistyles';

import { storage } from '@/utils/storage';

import type { ThemeName } from '@/types';

import { STORAGE_KEYS } from '@/constants';

const availableThemes: ThemeName[] = ['light', 'dark'];

export function useTheme() {
  const { theme } = useUnistyles();
  const [, setStoredTheme] = useMMKVString(STORAGE_KEYS.THEME, storage);

  const currentTheme = UnistylesRuntime.themeName as ThemeName;

  const setTheme = useCallback(
    (name: ThemeName) => {
      UnistylesRuntime.setTheme(name);
      setStoredTheme(name);
    },
    [setStoredTheme],
  );

  const toggleTheme = useCallback(() => {
    const next = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [currentTheme, setTheme]);

  return { theme, currentTheme, availableThemes, setTheme, toggleTheme };
}
