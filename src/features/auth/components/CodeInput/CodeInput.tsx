import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, TextInput, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import { SHAKE_STEP_MS, SHAKE_STEPS, useShakeAnimation } from '@/hooks';

import type { CodeBoxProps, CodeInputProps } from './types';

const DISALLOWED = {
  numeric: /\D/g,
  alphanumeric: /\W/g,
} as const;

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
  inputMode = 'numeric',
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
  const errorProgress = useSharedValue(0);

  // Each new error: borders turn red while the row shakes, then fade back.
  useEffect(() => {
    if (!error) return;
    errorProgress.value = withSequence(
      withTiming(1, { duration: 0 }),
      withDelay(
        SHAKE_STEP_MS * SHAKE_STEPS,
        withTiming(0, { duration: ERROR_FADE_MS }),
      ),
    );
  }, [error, errorProgress]);

  const shakeStyle = useShakeAnimation(error);
  const rowStyle = useAnimatedStyle(() => ({
    opacity: withTiming(busy ? BUSY_OPACITY : 1, { duration: BUSY_FADE_MS }),
  }));

  const setRefs = (node: TextInput | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <View style={style}>
      <Animated.View
        accessibilityState={{ busy }}
        style={[rowStyle, shakeStyle]}
      >
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
          onChangeText(text.replace(DISALLOWED[inputMode], '').slice(0, length))
        }
        maxLength={length}
        keyboardType={inputMode === 'numeric' ? 'number-pad' : 'default'}
        autoCapitalize="none"
        autoCorrect={false}
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
  // Boxes shrink to fit long codes (8 boxes on a small phone) and stay
  // centred at full size for short ones.
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(2.5),
  },
  box: {
    flex: 1,
    maxWidth: theme.spacing(12),
    aspectRatio: 1,
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
