import { Stack } from 'expo-router';

/** Home tab: the home screen plus its detail screens (tab bar stays visible). */
export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
