import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken } from '@/ui/theme';

import type { SliderIndicatorProps } from './types';

/**
 * Row of dots under a carousel; the current slide's dot is filled.
 *
 * @example
 * <SliderIndicator count={items.length} active={index} activeColor="primary" />
 */
export function SliderIndicator({
  count,
  active,
  activeColor = 'foreground',
  inactiveColor = 'background',
  style,
}: SliderIndicatorProps) {
  const { t } = useTranslation();

  return (
    <View
      accessible
      accessibilityLabel={t('common.slideOf', {
        current: active + 1,
        total: count,
      })}
      style={[styles.row, style]}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={styles.dot(i === active ? activeColor : inactiveColor)}
        />
      ))}
    </View>
  );
}

SliderIndicator.displayName = 'SliderIndicator';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
  },
  dot: (color: ColorToken) => ({
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginHorizontal: theme.spacing(1),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.foreground,
    backgroundColor: theme.colors[color],
  }),
}));
