export const STORAGE_KEYS = {
  /** Access token (stored in iOS Keychain / Android Keystore via expo-secure-store) */
  ACCESS_TOKEN: 'auth_access_token',
  /** User language preference (stored in plain MMKV) */
  LANGUAGE: 'app-language',
  /** User theme preference (stored in plain MMKV) */
  THEME: 'app-theme',
  /** Set on first launch (plain MMKV) — detects reinstalls, see loadAuthFromStorage */
  HAS_LAUNCHED: 'app-has-launched',
  /** Set once the Home tour (onboarding) was finished on this device (plain MMKV) */
  ONBOARDING_DONE: 'app-onboarding-done',
  /** Settings: push notifications switch (plain MMKV; no push service yet) */
  PUSH_ENABLED: 'settings-push-enabled',
  /** Settings: geolocation switch (plain MMKV; on only with OS permission) */
  LOCATION_ENABLED: 'settings-location-enabled',
} as const;
