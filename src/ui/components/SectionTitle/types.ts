import type { StyleProp, TextStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type SectionTitleProps = {
  title: string;
  /** Defaults to `foreground`; `onBrand` on green sections. */
  color?: ColorToken;
  style?: StyleProp<TextStyle>;
};
