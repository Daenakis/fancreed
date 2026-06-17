import '@/i18n';

import Bugsnag from '@bugsnag/expo';
import BugsnagPerformance from '@bugsnag/expo-performance';
import { type ErrorBoundaryProps, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorFallback } from '@/ui/components';

import { useAppReady } from '@/hooks';

import { QueryProvider } from '@/providers';

import { useAuthStore } from '@/store';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Bugsnag.notify(error);
  }, [error]);

  return <ErrorFallback error={error} onRetry={retry} />;
}

function RootLayout() {
  const isReady = useAppReady();

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default BugsnagPerformance.withInstrumentedAppStarts(RootLayout);
