import { ActivityIndicator, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Text } from '@/ui/components';

import type { AuthButtonProps } from './types';

/**
 * Full-width submit button for brand-coloured auth screens:
 * white when active, dark green when disabled.
 */
export function AuthButton({
  title,
  loading = false,
  disabled = false,
  style,
  ...props
}: AuthButtonProps) {
  const { theme } = useUnistyles();
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      style={({ pressed }) => [
        styles.button(inactive),
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.brand} />
      ) : (
        <Text
          variant="bodyMMedium"
          color={inactive ? 'brandMutedForeground' : 'brand'}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

AuthButton.displayName = 'AuthButton';

const styles = StyleSheet.create((theme) => ({
  button: (inactive: boolean) => ({
    height: theme.spacing(12),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: inactive ? theme.colors.brandStrong : theme.colors.onBrand,
  }),
  pressed: {
    opacity: 0.8,
  },
}));
