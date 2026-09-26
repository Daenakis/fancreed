import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { ErrorFallbackProps } from './types';

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <View accessibilityRole="alert" style={styles.container}>
      <Text
        variant="h4Semibold"
        accessibilityRole="header"
        style={styles.title}
      >
        {t('errors.unknown')}
      </Text>
      <Text
        variant="bodyMRegular"
        color="mutedForeground"
        style={styles.message}
      >
        {error.message}
      </Text>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('errors.tryAgain')}
          style={styles.button}
          onPress={onRetry}
        >
          <Text variant="bodyMSemibold" color="primaryForeground">
            {t('errors.tryAgain')}
          </Text>
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
    marginBottom: theme.spacing(2),
  },
  message: {
    textAlign: 'center',
    marginBottom: theme.spacing(6),
  },
  button: {
    paddingHorizontal: theme.spacing(6),
    paddingVertical: theme.spacing(3),
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
  },
}));
