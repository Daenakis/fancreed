import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, TextInput as RNTextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { useShakeAnimation } from '@/hooks';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { TextInputProps, TextInputVariant } from './types';

/**
 * Text field with optional label, error (red border + shake), leading image,
 * prefix, trailing accessory and a show/hide toggle for `secureTextEntry`.
 *
 * @example
 * <TextInput label={t('auth.emailPlaceholder')} value={email} onChangeText={setEmail} />
 * <TextInput label={t('auth.password')} secureTextEntry error={errors.password?.message} />
 */
export function TextInput({
  label,
  error,
  leftIcon,
  prefix,
  shakeKey = 0,
  rightAccessory,
  disabled = false,
  variant = 'default',
  secureTextEntry = false,
  multiline,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const inverse = variant === 'inverse';
  const onColor = inverse ? theme.colors.onBrand : theme.colors.foreground;
  const shakeStyle = useShakeAnimation(
    error ? `${error}|${shakeKey}` : undefined,
  );

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          variant="bodyMMedium"
          color={inverse ? 'onBrand' : 'foreground'}
          style={styles.label}
        >
          {label}
        </Text>
      ) : null}
      <Animated.View
        style={[
          styles.field(variant, focused, !!error, disabled, !!multiline),
          shakeStyle,
        ]}
      >
        {leftIcon ? <Image source={leftIcon} style={styles.leftIcon} /> : null}
        {prefix ? (
          <Text
            variant="bodyLRegular"
            color={inverse ? 'brandMutedForeground' : 'mutedForeground'}
            style={styles.prefix}
          >
            {prefix}
          </Text>
        ) : null}
        <RNTextInput
          placeholderTextColor={
            inverse
              ? theme.colors.brandMutedForeground
              : theme.colors.mutedForeground
          }
          selectionColor={inverse ? theme.colors.onBrand : theme.colors.primary}
          accessibilityLabel={label}
          accessibilityState={{ disabled }}
          editable={!disabled}
          multiline={multiline}
          secureTextEntry={secureTextEntry && hidden}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input(variant, disabled),
            multiline && styles.multiline,
            style,
          ]}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(
              hidden ? 'common.showPassword' : 'common.hidePassword',
            )}
            hitSlop={8}
            onPress={() => setHidden((h) => !h)}
            style={styles.accessory}
          >
            <Icon name={hidden ? 'eyeClose' : 'eyeOpen'} color={onColor} />
          </Pressable>
        ) : null}
        {rightAccessory ? (
          <View style={styles.accessory}>{rightAccessory}</View>
        ) : null}
      </Animated.View>
      {error ? (
        <Text variant="bodySRegular" color="destructive" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create((theme) => ({
  label: {
    marginBottom: theme.spacing(1),
  },
  prefix: {
    marginRight: theme.spacing(1),
  },
  field: (
    variant: TextInputVariant,
    focused: boolean,
    hasError: boolean,
    disabled: boolean,
    multiline: boolean,
  ) => {
    const inverse = variant === 'inverse';
    const idleBorder = inverse ? theme.colors.brandBorder : theme.colors.border;
    const focusBorder = inverse ? theme.colors.onBrand : theme.colors.ring;

    return {
      flexDirection: 'row',
      alignItems: 'center',
      // Fixed height for one line: typing must not change the field size.
      height: multiline ? undefined : theme.spacing(12),
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing(4),
      borderColor: hasError
        ? theme.colors.destructive
        : focused
          ? focusBorder
          : idleBorder,
      backgroundColor: disabled
        ? theme.colors.muted
        : inverse
          ? theme.colors.brandSurface
          : theme.colors.background,
    };
  },
  // No lineHeight on single-line inputs: on iOS it makes the height jump
  // between the placeholder and typed text.
  input: (variant: TextInputVariant, disabled: boolean) => ({
    fontFamily: theme.typography.bodyLRegular.fontFamily,
    fontSize: theme.typography.bodyLRegular.fontSize,
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 0,
    color: disabled
      ? theme.colors.mutedForeground
      : variant === 'inverse'
        ? theme.colors.onBrand
        : theme.colors.foreground,
  }),
  multiline: {
    lineHeight: theme.typography.bodyLRegular.lineHeight,
    paddingVertical: theme.spacing(2.5),
    minHeight: theme.spacing(30),
    textAlignVertical: 'top',
  },
  leftIcon: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(2.5),
  },
  accessory: {
    marginLeft: theme.spacing(2),
  },
  error: {
    marginTop: theme.spacing(1),
  },
}));
