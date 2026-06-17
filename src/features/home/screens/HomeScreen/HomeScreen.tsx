import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { useAuthStore } from '@/store';

export function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('home.title')}
      </Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
      <View style={styles.buttons}>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => router.push('/(app)/playground')}
        >
          <Text style={styles.buttonText}>{t('playground.title')}</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('auth.signOut')}
          style={styles.buttonDestructive}
          onPress={signOut}
        >
          <Text style={styles.buttonDestructiveText}>{t('auth.signOut')}</Text>
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
    fontSize: theme.font.sizes['2xl'],
    fontWeight: theme.font.weights.bold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.mutedForeground,
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
  buttonText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.primaryForeground,
  },
  buttonDestructive: {
    paddingHorizontal: theme.spacing(8),
    paddingVertical: theme.spacing(3.5),
    backgroundColor: theme.colors.destructive,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  buttonDestructiveText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.destructiveForeground,
  },
}));
