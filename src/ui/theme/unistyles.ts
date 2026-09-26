import { StyleSheet } from 'react-native-unistyles';

import { storage } from '@/utils/storage';

import type { ThemeName } from '@/types';

import { STORAGE_KEYS } from '@/constants';

import { darkColors, lightColors } from './colors';
import { typography } from './fonts';
import { breakpoints, radius, spacing } from './metrics';

const shared = {
  spacing,
  radius,
  typography,
} as const;

export const lightTheme = { colors: lightColors, ...shared };
export const darkTheme = { colors: darkColors, ...shared };

type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging required by Unistyles
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- declaration merging required by Unistyles
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

/**
 * Restores the saved theme preference before the first render (no flash).
 * A fixed light/dark choice uses that theme; 'system' or no choice yet
 * follows the device colour scheme via Unistyles adaptive themes.
 */
function resolveThemeSettings() {
  const saved = storage.getString(STORAGE_KEYS.THEME);

  if (saved === 'light' || saved === 'dark') {
    return { initialTheme: saved as ThemeName };
  }

  return { adaptiveThemes: true };
}

StyleSheet.configure({
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  breakpoints,
  settings: resolveThemeSettings(),
});
