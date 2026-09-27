import { Stack } from 'expo-router';

// Keep the tab's main screen under a deep-linked inner screen, so Back
// returns to it and the tab isn't stuck on the linked screen.
export const unstable_settings = { initialRouteName: 'index' };

/** Home tab: the home screen plus its detail screens (tab bar stays visible). */
export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
