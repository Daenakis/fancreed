import type { Ref } from 'react';
import type { Text as RNText, TextProps as RNTextProps } from 'react-native';

import type { ColorToken, TypographyVariant } from '@/ui/theme';

export type TextProps = RNTextProps & {
  /** Typography style from Figma. Defaults to `bodyLRegular`. */
  variant?: TypographyVariant;
  /** Theme colour token. Defaults to `foreground`. */
  color?: ColorToken;
  ref?: Ref<RNText>;
};
