import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken } from '@/ui/theme';

import type { SliderIndicatorProps } from './types';

/**
 * Page indicator under a carousel: a green pill for the current slide,
 * short grey dashes for the others.
 *
 * @example
 * <SliderIndicator count={items.length} active={index} activeColor="primary" />
 */
export function SliderIndicator({
  count,
  active,
  activeColor = 'brand',
  inactiveColor = 'border',
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
          style={styles.dot(
            i === active ? activeColor : inactiveColor,
            i === active,
          )}
        />
      ))}
    </View>
  );
}

SliderIndicator.displayName = 'SliderIndicator';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  // Figma: the current page is a longer pill, the others short dashes.
  dot: (color: ColorToken, active: boolean) => ({
    width: active ? theme.spacing(4) : theme.spacing(1.5),
    height: theme.spacing(1),
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors[color],
  }),
}));
