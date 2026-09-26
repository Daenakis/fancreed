import { useEffect } from 'react';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const OFFSET = 8;
export const SHAKE_STEP_MS = 50;
export const SHAKE_STEPS = 5;

/**
 * Horizontal "no" shake, e.g. for a field with a new error. Shakes each time
 * `trigger` changes to a truthy value; skipped when Reduce Motion is on.
 *
 * @example
 * const shakeStyle = useShakeAnimation(error);
 * <Animated.View style={shakeStyle}>…</Animated.View>
 */
export function useShakeAnimation(trigger: unknown) {
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(0);

  useEffect(() => {
    if (!trigger || reduceMotion) return;
    x.value = withSequence(
      withTiming(-OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(-OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(0, { duration: SHAKE_STEP_MS }),
    );
  }, [trigger, reduceMotion, x]);

  return useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
}
