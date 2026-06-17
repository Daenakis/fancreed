export const STORAGE_KEYS = {
  /** Access token (stored in iOS Keychain / Android Keystore via expo-secure-store) */
  ACCESS_TOKEN: 'auth_access_token',
  /** Refresh token (stored in iOS Keychain / Android Keystore via expo-secure-store) */
  REFRESH_TOKEN: 'auth_refresh_token',
  /** User language preference (stored in plain MMKV) */
  LANGUAGE: 'app-language',
  /** User theme preference (stored in plain MMKV) */
  THEME: 'app-theme',
} as const;
