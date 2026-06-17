import { focusManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

/**
 * Connects React Query's `focusManager` to the app lifecycle.
 *
 * Why: On the web, React Query automatically refetches stale queries when the
 *      browser tab regains focus (`visibilitychange` event). React Native has
 *      no such event — we use `AppState` instead so queries refetch when the
 *      user switches back to the app from the background.
 *
 * This enables the default `refetchOnWindowFocus: true` behavior on mobile.
 *
 * @see https://tanstack.com/query/v5/docs/framework/react/react-native#refetch-on-app-focus
 */
export function useAppFocusManager() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}
