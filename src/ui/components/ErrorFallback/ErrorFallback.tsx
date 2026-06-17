import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ErrorFallbackProps } from './types';

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        {t('errors.unknown')}
      </Text>
      <Text style={styles.message}>{error.message}</Text>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('errors.tryAgain')}
          style={styles.button}
          onPress={onRetry}
        >
          <Text style={styles.buttonText}>{t('errors.tryAgain')}</Text>
        </Pressable>
      )}
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
    fontSize: theme.font.sizes.lg,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing(2),
  },
  message: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.mutedForeground,
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  button: {
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
  buttonText: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.semibold,
    color: theme.colors.primaryForeground,
  },
}));
