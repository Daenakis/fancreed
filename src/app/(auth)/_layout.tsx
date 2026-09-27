import { Stack } from 'expo-router';

/** Signed-out flow: sign-in, sign-up, activation and password recovery. */
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
