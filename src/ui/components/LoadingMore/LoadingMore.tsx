import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { LoadingMoreProps } from './types';

/**
 * Spinner at the end of a list while the next page loads. Its space is
 * always reserved so the list doesn't jump when loading starts or stops.
 *
 * @example
 * <FlatList ListFooterComponent={<LoadingMore loading={isFetchingNextPage} />} />
 */
export function LoadingMore({
  loading,
  color = 'mutedForeground',
  horizontal = false,
  style,
}: LoadingMoreProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();

  return (
    <View
      accessibilityLabel={loading ? t('common.loading') : undefined}
      accessibilityState={{ busy: loading }}
      style={[horizontal ? styles.horizontal : styles.vertical, style]}
    >
      <ActivityIndicator animating={loading} color={theme.colors[color]} />
    </View>
  );
}

LoadingMore.displayName = 'LoadingMore';

const styles = StyleSheet.create((theme) => ({
  vertical: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
  },
  horizontal: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(6),
  },
}));
