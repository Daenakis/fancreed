import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { useLogoutMutation } from '@/hooks';

export function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const logout = useLogoutMutation();

  return (
    <View style={styles.container}>
      <Text
        variant="h1Semibold"
        accessibilityRole="header"
        style={styles.title}
      >
        {t('home.title')}
      </Text>
      <Text color="mutedForeground" style={styles.subtitle}>
        {t('home.subtitle')}
      </Text>
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => router.push('/(app)/playground')}
        >
          <Text variant="bodyLMedium" color="primaryForeground">
            {t('playground.title')}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('auth.signOut')}
          style={styles.buttonDestructive}
          onPress={() => logout.mutate()}
        >
          <Text variant="bodyLMedium" color="destructiveForeground">
            {t('auth.signOut')}
          </Text>
        </Pressable>
      </View>
    </View>
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
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(8),
  },
  buttons: {
    gap: theme.spacing(3),
  },
  button: {
    paddingHorizontal: theme.spacing(8),
    paddingVertical: theme.spacing(3.5),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  buttonDestructive: {
    paddingHorizontal: theme.spacing(8),
    paddingVertical: theme.spacing(3.5),
    backgroundColor: theme.colors.destructive,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
}));
