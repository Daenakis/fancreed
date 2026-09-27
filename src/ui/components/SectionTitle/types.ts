import type { StyleProp, TextStyle } from 'react-native';

import type { ColorToken, TypographyVariant } from '@/ui/theme';

export type SectionTitleProps = {
  title: string;
  /** Defaults to `foreground`; `onBrand` on green sections. */
  color?: ColorToken;
  /** Defaults to `h3Medium`; smaller inside cards. */
  variant?: TypographyVariant;
  style?: StyleProp<TextStyle>;
};
