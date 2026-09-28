import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import { CLUB_LOGO, CLUB_LOGO_HEIGHT, CLUB_LOGO_WIDTH } from '@/constants';

import type { PageLoaderProps } from './types';

/** One beat: grow + brighten, then back (the repeat reverses it). */
const PULSE_MS = 700;

/**
 * Whole-screen loading state: the club logo pulsing in the middle of the
 * free space (fills it like EmptyState). Still when Reduce Motion is on.
 * For the end of a list use LoadingMore.
 *
 * @example
 * {isPending ? <PageLoader /> : <Content />}
 */
export function PageLoader({ size = 88, style }: PageLoaderProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: PULSE_MS, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: 0.55 + 0.45 * pulse.value,
    transform: [{ scale: 0.9 + 0.15 * pulse.value }],
  }));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={t('common.loading')}
      accessibilityState={{ busy: true }}
      style={[styles.root, style]}
    >
      <Animated.Image
        source={CLUB_LOGO}
        resizeMode="contain"
        style={[
          { width: size, height: (size * CLUB_LOGO_HEIGHT) / CLUB_LOGO_WIDTH },
          logoStyle,
        ]}
      />
    </View>
  );
}

PageLoader.displayName = 'PageLoader';

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing(6),
  },
}));
