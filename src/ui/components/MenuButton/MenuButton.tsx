import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native-unistyles';

import type { BarProps, MenuButtonProps } from './types';

/** Matches the side menu's slide-out, so it's lines again as the menu goes. */
const MORPH_MS = 220;
// Geometry of the `menu` icon (20-unit viewBox, 1.5 stroke) drawn at 24 pt,
// so the closed button looks exactly like the old icon.
const SIZE = 24;
const STROKE = 1.8;
const BAR = 16 + STROKE; // line + round caps
const GAP = 6; // between line centres

/**
 * The menu toggle: three lines that turn into a cross when `open` — the
 * middle line fades, the outer two meet in the middle and rotate. The same
 * button sits in the app header and, at the same spot, over the side menu,
 * so it never leaves the screen.
 */
export function MenuButton({
  open,
  onPress,
  disabled = false,
  style,
}: MenuButtonProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  // Always starts as lines: a button mounted `open` (the side menu's) morphs
  // into the cross instead of appearing as one.
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(open ? 1 : 0, {
      duration: reduceMotion ? 0 : MORPH_MS,
    });
  }, [open, reduceMotion, progress]);

  const top = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, GAP]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` },
    ],
  }));
  const middle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5], [1, 0], 'clamp'),
  }));
  const bottom = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -GAP]) },
      { rotate: `${interpolate(progress.value, [0, 1], [0, -45])}deg` },
    ],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(open ? 'common.close' : 'nav.menu')}
      accessibilityState={{ disabled, expanded: open }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.box, pressed && styles.pressed, style]}
    >
      <Bar style={[styles.bar(-GAP), top]} />
      <Bar style={[styles.bar(0), middle]} />
      <Bar style={[styles.bar(GAP), bottom]} />
    </Pressable>
  );
}

MenuButton.displayName = 'MenuButton';

function Bar({ style }: BarProps) {
  return <Animated.View style={style} />;
}

const styles = StyleSheet.create((theme) => ({
  box: {
    width: SIZE,
    height: SIZE,
  },
  pressed: {
    opacity: 0.7,
  },
  // Centred in the box, `offset` from the middle line.
  bar: (offset: number) => ({
    position: 'absolute',
    left: (SIZE - BAR) / 2,
    top: SIZE / 2 - STROKE / 2 + offset,
    width: BAR,
    height: STROKE,
    borderRadius: STROKE / 2,
    backgroundColor: theme.colors.foreground,
  }),
}));
