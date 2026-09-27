import { Stack } from 'expo-router';

// Keep the tab's main screen under a deep-linked inner screen, so Back
// returns to it and the tab isn't stuck on the linked screen.
export const unstable_settings = { initialRouteName: 'index' };

/** Fan-centre tab: its main screen plus fan clubs and their events. */
export default function GamificationLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
