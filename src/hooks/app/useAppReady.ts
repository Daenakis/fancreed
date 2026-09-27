import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { queryClient } from '@/providers/queryClient';

import { loadAuthFromStorage, useAuthStore } from '@/store';

import { CLUB_LOGO } from '@/constants';

import { profileQueryOptions } from '../query/profile';

/** Longest the splash waits for the profile (the welcome-back greeting). */
const PROFILE_PREFETCH_MS = 1500;
/** Longest the splash waits for the logo. */
const LOGO_PRELOAD_MS = 1000;

/**
 * Decode the club logo before the first screen, so the welcome/sign-in
 * intros don't start on an empty spot (in dev it's even fetched from Metro).
 */
const preloadLogo = () => {
  const uri = Image.resolveAssetSource(CLUB_LOGO)?.uri;
  if (!uri) return Promise.resolve(false);
  return Promise.race([
    Image.prefetch(uri).catch(() => false),
    new Promise((resolve) => setTimeout(resolve, LOGO_PRELOAD_MS)),
  ]);
};

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
        const logo = preloadLogo();
        await loadAuthFromStorage();

        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          // Load the profile under the splash so the welcome-back greeting
          // can start at once; a slow network doesn't hold the splash long.
          await Promise.race([
            queryClient.prefetchQuery(profileQueryOptions()),
            new Promise((resolve) => setTimeout(resolve, PROFILE_PREFETCH_MS)),
          ]);
        }
        await logo;
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
