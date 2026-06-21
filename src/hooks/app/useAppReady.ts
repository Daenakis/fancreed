import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { loadAuthFromStorage, useAuthStore } from '@/store';

export function useAppReady() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('../../../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../../../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../../../assets/fonts/Inter-SemiBold.ttf'),
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) return;

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
        SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  return isReady;
}
