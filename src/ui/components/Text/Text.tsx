import { Text as RNText } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { ColorToken, TypographyVariant } from '@/ui/theme';

import type { TextProps } from './types';

/**
 * The only way to render text in the app — applies the Inter typography
 * scale and a theme colour, so text follows the design system and dark mode.
 *
 * @example
 * <Text variant="h1Semibold" accessibilityRole="header">Title</Text>
 * <Text variant="bodyMRegular" color="mutedForeground">Caption</Text>
 */
export function Text({
  variant = 'bodyLRegular',
  color = 'foreground',
  style,
  ...props
}: TextProps) {
  return <RNText style={[styles.text(variant, color), style]} {...props} />;
}

Text.displayName = 'Text';

const styles = StyleSheet.create((theme) => ({
  text: (variant: TypographyVariant, color: ColorToken) => ({
    ...theme.typography[variant],
    color: theme.colors[color],
  }),
}));
