import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

/**
 * - `photo` (default): tall full-bleed photo, e.g. a player in a vote carousel.
 * - `tile`: small framed tile with the image inset, e.g. an event or challenge.
 */
export type ImageCardVariant = 'photo' | 'tile';

export type ImageCardProps = {
  /** URL or local image; a grey placeholder is shown when missing. */
  image?: string | ImageSourcePropType | null;
  /** Caption under the image. */
  title?: string | null;
  /** Second caption line, e.g. a vote share "45%". */
  subtitle?: string;
  /** Defaults to `photo`. */
  variant?: ImageCardVariant;
  /** Makes the card pressable. */
  onPress?: () => void;
  /** Theme colour of the captions. Defaults to `foreground`. */
  textColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};
