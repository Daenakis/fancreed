import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn&apos;t exist</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
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
    fontSize: theme.font.sizes.lg,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(4),
  },
  link: {
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
  linkText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.primaryForeground,
  },
}));
