import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, TextInput as RNTextInput, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { TextInputProps, TextInputVariant } from './types';

/**
 * Text field with optional label, error, leading image, trailing accessory
 * and a show/hide toggle for `secureTextEntry`.
 *
 * @example
 * <TextInput label={t('auth.email')} value={email} onChangeText={setEmail} />
 * <TextInput label={t('auth.password')} secureTextEntry error={errors.password?.message} />
 */
export function TextInput({
  label,
  error,
  leftIcon,
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
      <View style={styles.field(variant, focused, !!error, disabled)}>
        {leftIcon ? <Image source={leftIcon} style={styles.leftIcon} /> : null}
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
      </View>
      {error ? (
        <Text
          variant="bodySRegular"
          color={inverse ? 'destructiveMuted' : 'destructive'}
          style={styles.error}
        >
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
  field: (
    variant: TextInputVariant,
    focused: boolean,
    hasError: boolean,
    disabled: boolean,
  ) => {
    const inverse = variant === 'inverse';
    const idleBorder = inverse ? theme.colors.brandBorder : theme.colors.border;
    const focusBorder = inverse ? theme.colors.onBrand : theme.colors.ring;

    return {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing(4),
      borderColor: hasError
        ? inverse
          ? theme.colors.destructiveMuted
          : theme.colors.destructive
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
  input: (variant: TextInputVariant, disabled: boolean) => ({
    ...theme.typography.bodyLRegular,
    flex: 1,
    paddingVertical: theme.spacing(2.5),
    color: disabled
      ? theme.colors.mutedForeground
      : variant === 'inverse'
        ? theme.colors.onBrand
        : theme.colors.foreground,
  }),
  multiline: {
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
