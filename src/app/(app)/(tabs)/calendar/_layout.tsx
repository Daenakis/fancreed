import { Stack } from 'expo-router';

// Keep the tab's main screen under a deep-linked inner screen, so Back
// returns to it and the tab isn't stuck on the linked screen.
export const unstable_settings = { initialRouteName: 'index' };

/** Calendar tab: the match calendar plus its detail screens. */
export default function CalendarLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
