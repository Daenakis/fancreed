import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken } from '@/ui/theme';

import type { SkeletonProps } from './types';

const PULSE_MS = 700;

/**
 * Grey placeholder block that pulses while content loads. Build loading
 * layouts from these in the shape of the real content.
 *
 * @example
 * <Skeleton width="60%" height={14} />
 * <Skeleton width={40} height={40} radius="full" />
 */
export function Skeleton({
  width,
  height,
  radius = 'sm',
  color = 'muted',
  still = false,
  style,
}: SkeletonProps) {
  const reduceMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (still || reduceMotion) return;
    opacity.value = withRepeat(
      withTiming(0.4, { duration: PULSE_MS }),
      -1,
      true,
    );
  }, [still, reduceMotion, opacity]);

  const pulse = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.block(radius, color), { width, height }, pulse, style]}
    />
  );
}

Skeleton.displayName = 'Skeleton';

const styles = StyleSheet.create((theme) => ({
  block: (radius: NonNullable<SkeletonProps['radius']>, color: ColorToken) => ({
    borderRadius: theme.radius[radius],
    backgroundColor: theme.colors[color],
  }),
}));
