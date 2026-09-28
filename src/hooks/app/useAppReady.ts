import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { queryClient } from '@/providers/queryClient';

import { loadAuthFromStorage, useAuthStore, useSplashStore } from '@/store';

import { CLUB_LOGO, FAN_SHOP_BANNER } from '@/constants';

import { profileQueryOptions } from '../query/profile';

/** Longest the splash waits for the profile (the welcome-back greeting). */
const PROFILE_PREFETCH_MS = 1500;
/** Longest the splash waits for the preloaded images. */
const IMAGES_PRELOAD_MS = 1000;
/**
 * Bundled pictures decoded before the first screen: the club logo (so the
 * welcome/sign-in intros don't start on an empty spot) and the Home fan-shop
 * banner (so it's cached when Home opens). In dev they come from Metro.
 */
const PRELOADED_IMAGES = [CLUB_LOGO, FAN_SHOP_BANNER];

const preloadImages = () =>
  Promise.race([
    Promise.all(
      PRELOADED_IMAGES.map((image) => {
        const uri = Image.resolveAssetSource(image)?.uri;
        return uri ? Image.prefetch(uri).catch(() => false) : false;
      }),
    ),
    new Promise((resolve) => setTimeout(resolve, IMAGES_PRELOAD_MS)),
  ]);

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
        const images = preloadImages();
        await loadAuthFromStorage();

        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          // A stored session opens with the "welcome back" splash.
          useSplashStore.getState().show('back', 'center');
          // Load the profile under the splash so the welcome-back greeting
          // can start at once; a slow network doesn't hold the splash long.
          await Promise.race([
            queryClient.prefetchQuery(profileQueryOptions()),
            new Promise((resolve) => setTimeout(resolve, PROFILE_PREFETCH_MS)),
          ]);
        }
        await images;
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
