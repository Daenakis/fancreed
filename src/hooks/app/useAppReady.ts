import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { loadAuthFromStorage, useAuthStore } from '@/store';

/**
 * Prepares the app while the native splash screen is visible.
 * Returns true once the root navigator can render.
 *
 * Never blocks forever: a font loading error falls back to the system font,
 * and a storage error starts the app signed out.
 *
 * Fonts are loaded at runtime (not only via the expo-font config plugin)
 * because the files' PostScript names are `Inter18pt-*`; iOS only resolves
 * embedded fonts by PostScript name, while `useFonts` registers them under
 * the `Inter-*` names used in `theme.typography`.
 */
export function useAppReady() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../../assets/fonts/Inter-SemiBold.ttf'),
  });
  const fontsDone = fontsLoaded || !!fontError;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (fontError) {
      console.warn('Font loading failed, using system font:', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (!fontsDone) return;

    async function prepare() {
      try {
        await loadAuthFromStorage();

        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          // Prefetch critical data while splash is still visible.
          // Example:
          // await queryClient.prefetchQuery({
          //   queryKey: [QueryKey.UserProfile],
          //   queryFn: fetchProfile,
          // });
        }
      } catch (error) {
        console.warn('App preparation failed:', error);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, [fontsDone]);

  // Hide the splash only after the navigator has rendered — avoids a blank
  // frame between the splash and the first screen.
  useEffect(() => {
    if (isReady) SplashScreen.hideAsync();
  }, [isReady]);

  return isReady;
}
