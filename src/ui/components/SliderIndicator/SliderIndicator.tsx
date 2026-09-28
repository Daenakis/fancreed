import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { DotProps, SliderIndicatorProps } from './types';

const MORPH_MS = 250;

/**
 * Page indicator under a carousel: a green pill for the current slide,
 * short grey dashes for the others. On a page change the old pill squishes
 * into a dash while the new one stretches into the pill.
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
  const { theme } = useUnistyles();

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
        <Dot
          key={i}
          active={i === active}
          activeColor={theme.colors[activeColor]}
          inactiveColor={theme.colors[inactiveColor]}
          activeWidth={theme.spacing(4)}
          inactiveWidth={theme.spacing(1.5)}
        />
      ))}
    </View>
  );
}

SliderIndicator.displayName = 'SliderIndicator';

function Dot({
  active,
  activeColor,
  inactiveColor,
  activeWidth,
  inactiveWidth,
}: DotProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: reduceMotion ? 0 : MORPH_MS,
    });
  }, [active, reduceMotion, progress]);

  const animated = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [inactiveWidth, activeWidth]),
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor],
    ),
  }));

  return <Animated.View style={[styles.dot, animated]} />;
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  // Figma: the current page is a longer pill, the others short dashes.
  dot: {
    height: theme.spacing(1),
    borderRadius: theme.radius.full,
  },
}));
