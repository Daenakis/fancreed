import { Stack } from 'expo-router';

/** Signed-in app: the tab shell plus screens pushed on top of it. */
export default function AppLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
