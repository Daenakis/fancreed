import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';
import type { ColorToken } from '@/ui/theme';

/**
 * - `photo` (default): tall full-bleed photo, e.g. a player in a vote carousel.
 * - `tile`: small framed tile with the image inset, e.g. an event or challenge.
 * - `article`: wide cover image with a left-aligned title and description
 *   (news).
 */
export type ImageCardVariant = 'photo' | 'tile' | 'article';

export type ImageCardProps = {
  /** URL or local image; a grey placeholder is shown when missing. */
  image?: string | ImageSourcePropType | null;
  /** Caption under the image. */
  title?: string | null;
  /** Second caption line, e.g. a vote share "45%" or a city. */
  subtitle?: string;
  /** Icon before the subtitle, e.g. `location` for a club's city. */
  subtitleIcon?: IconName;
  /** `article` only: body text under the title, cut to 4 lines. */
  description?: string;
  /** Defaults to `photo`. */
  variant?: ImageCardVariant;
  /** Makes the card pressable. */
  onPress?: () => void;
  /** `tile` only: frame background. Defaults to `translucentSurface` (for coloured backgrounds). */
  tileSurface?: ColorToken;
  /** Theme colour of the captions. Defaults to `foreground`. */
  textColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
};
