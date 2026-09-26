import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { useAuthStore } from '@/store';

export function SignInScreen() {
  const { t } = useTranslation();
  const signIn = useAuthStore((s) => s.signIn);

  const handleSignIn = () => {
    signIn('mock-access-token', 'mock-refresh-token');
  };

  return (
    <View style={styles.container}>
      <Text
        variant="h1Semibold"
        accessibilityRole="header"
        style={styles.title}
      >
        {t('auth.welcomeTitle')}
      </Text>
      <Text color="mutedForeground" style={styles.subtitle}>
        {t('auth.welcomeSubtitle')}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('auth.signIn')}
        style={styles.button}
        onPress={handleSignIn}
      >
        <Text variant="bodyLMedium" color="primaryForeground">
          {t('auth.signIn')}
        </Text>
      </Pressable>
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
  button: {
    paddingHorizontal: theme.spacing(8),
    paddingVertical: theme.spacing(3.5),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
}));
