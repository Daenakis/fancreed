import { Stack } from 'expo-router';

/** Calendar tab: the match calendar plus its detail screens. */
export default function CalendarLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
