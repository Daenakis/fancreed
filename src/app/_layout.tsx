import '@/i18n';

import Bugsnag from '@bugsnag/expo';
import BugsnagPerformance from '@bugsnag/expo-performance';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

import { ErrorFallback } from '@/ui/components';

import { useAppReady } from '@/hooks';

import { QueryProvider } from '@/providers';

import { useAuthStore, useSplashStore } from '@/store';

import { WelcomeBack } from '@/features/shell';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    // Bugsnag only runs when an API key is configured (see src/config/bugsnag.ts)
    if (Bugsnag.isStarted()) Bugsnag.notify(error);
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}

function RootLayout() {
  const isReady = useAppReady();
  const { rt } = useUnistyles();
  // Welcome splash: after a launch with a stored session or a sign-in.
  const splash = useSplashStore((s) => s.splash);
  const hideSplash = useSplashStore((s) => s.hide);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <RootNavigator />
        {splash ? (
          <WelcomeBack
            greeting={splash.greeting}
            from={splash.from}
            onDone={hideSplash}
          />
        ) : null}
        {/* Follow the app theme, not the device — they differ when the user picks a fixed theme */}
        <StatusBar style={rt.themeName === 'dark' ? 'light' : 'dark'} />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

/**
 * Signed-in users get the app (tabs); everyone else the auth flow. The token
 * is restored from SecureStore before the first render (useAppReady), so a
 * stored session opens straight on Home.
 */
function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default BugsnagPerformance.withInstrumentedAppStarts(RootLayout);
