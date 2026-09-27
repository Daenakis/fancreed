import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { EmptyStateProps } from './types';

/** Centred icon + title + text, e.g. "coming soon" or "nothing here yet". */
export function EmptyState({ icon, title, text, style }: EmptyStateProps) {
  const { theme } = useUnistyles();

  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} size={48} color={theme.colors.mutedForeground} />
      <Text
        variant="h4Semibold"
        accessibilityRole="header"
        style={styles.centered}
      >
        {title}
      </Text>
      {text ? (
        <Text color="mutedForeground" style={styles.centered}>
          {text}
        </Text>
      ) : null}
    </View>
  );
}

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(3),
    padding: theme.spacing(8),
  },
  centered: {
    textAlign: 'center',
  },
}));
