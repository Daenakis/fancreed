import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text variant="h4Semibold" style={styles.title}>
          This screen doesn&apos;t exist
        </Text>
        <Link href="/" style={styles.link}>
          <Text variant="bodyMSemibold" color="primaryForeground">
            Go to Home
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(6),
    backgroundColor: theme.colors.background,
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  link: {
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
}));
