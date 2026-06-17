import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function AppLayout() {
  const { theme } = useUnistyles();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.foreground,
        headerTitleStyle: { fontWeight: theme.font.weights.semibold },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
