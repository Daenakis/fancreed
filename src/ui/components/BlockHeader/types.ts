import type { Ref } from 'react';
import type {
  ImageSourcePropType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type BlockHeaderProps = {
  /** Header text. */
  title: string;
  /** Theme colour of the tab. Defaults to `primary`. */
  backgroundColor?: ColorToken;
  /** Theme colour of the title. Defaults to `primaryForeground`. */
  textColor?: ColorToken;
  /** Image before the title (50×23), e.g. a sponsor badge. */
  image?: ImageSourcePropType;
  /** Home and away team logos before the title (22×22 each). */
  teamLogos?: [ImageSourcePropType, ImageSourcePropType];
  /** Thin border on the sides and bottom. Defaults to `false`. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
};
