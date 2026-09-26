import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { CodeBoxProps, CodeInputProps } from './types';

const SHAKE_OFFSET = 8;
const SHAKE_STEP_MS = 50;
const SHAKE_STEPS = 5;
/** Borders fade back to normal once the shake is over. */
const ERROR_FADE_MS = 150;
const BUSY_OPACITY = 0.5;
const BUSY_FADE_MS = 150;

/**
 * One-time code entry: a row of digit boxes backed by a single hidden
 * input, so paste and iOS/Android SMS autofill work.
 */
export function CodeInput({
  value,
  onChangeText,
  length = 6,
  error = false,
  busy = false,
  autoFocus = false,
  style,
  ref,
}: CodeInputProps) {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);
  const activeIndex = Math.min(value.length, length - 1);
  const reduceMotion = useReducedMotion();
  const shakeX = useSharedValue(0);
  const errorProgress = useSharedValue(0);

  // Each new error: borders turn red and the row shakes, then borders
  // fade back to their normal colour.
  useEffect(() => {
    if (!error) return;
    const shakeDuration = SHAKE_STEP_MS * SHAKE_STEPS;
    errorProgress.value = withSequence(
      withTiming(1, { duration: 0 }),
      withDelay(shakeDuration, withTiming(0, { duration: ERROR_FADE_MS })),
    );
    if (reduceMotion) return;
    shakeX.value = withSequence(
      withTiming(-SHAKE_OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(SHAKE_OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(-SHAKE_OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(SHAKE_OFFSET, { duration: SHAKE_STEP_MS }),
      withTiming(0, { duration: SHAKE_STEP_MS }),
    );
  }, [error, reduceMotion, shakeX, errorProgress]);

  const rowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(busy ? BUSY_OPACITY : 1, { duration: BUSY_FADE_MS }),
    transform: [{ translateX: shakeX.value }],
  }));

  const setRefs = (node: TextInput | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <View style={style}>
      <Animated.View accessibilityState={{ busy }} style={rowStyle}>
        <Pressable
          accessible={false}
          onPress={() => inputRef.current?.focus()}
          style={styles.row}
        >
          {Array.from({ length }, (_, i) => (
            <CodeBox
              key={i}
              digit={value[i]}
              label={t('auth.codeDigit', { index: i + 1, total: length })}
              active={focused && !busy && i === activeIndex}
              errorProgress={errorProgress}
            />
          ))}
        </Pressable>
      </Animated.View>
      <TextInput
        ref={setRefs}
        value={value}
        onChangeText={(text) =>
          onChangeText(text.replace(/\D/g, '').slice(0, length))
        }
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        autoFocus={autoFocus}
        caretHidden
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={t('auth.codeTitle')}
        style={styles.hiddenInput}
      />
    </View>
  );
}

CodeInput.displayName = 'CodeInput';

function CodeBox({ digit, label, active, errorProgress }: CodeBoxProps) {
  const { theme } = useUnistyles();
  const baseBorder = active ? theme.colors.onBrand : theme.colors.brandBorder;
  const errorBorder = theme.colors.destructive;

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      errorProgress.value,
      [0, 1],
      [baseBorder, errorBorder],
    ),
  }));

  return (
    <Animated.View accessibilityLabel={label} style={[styles.box, borderStyle]}>
      <Text
        variant="bodyLRegular"
        color={digit ? 'onBrand' : 'brandMutedForeground'}
      >
        {digit ?? '0'}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.brandSurface,
  },
  // Kept on screen (not display:none) so it can hold focus and receive autofill.
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
}));
