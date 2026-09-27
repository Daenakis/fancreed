import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

import type { LoyaltyLevel } from '@/types/api';

export type { LoyaltyLevel };

/**
 * - `compact` (default): card on the home screen; tap opens the full card.
 * - `full`: large landscape card; tapping flips it to the barcode side.
 */
export type FanCardVariant = 'compact' | 'full';

export type FanCardProps = {
  name?: string | null;
  surname?: string | null;
  /** Photo URL; a placeholder avatar shows without it. */
  photo?: string | null;
  /** Current season, e.g. "2025/2026". */
  season: string;
  /** Falls back to bronze, as in the old app. */
  loyaltyLevel?: LoyaltyLevel;
  /** Current loyalty points. The progress line shows with `nextLevelPoints`. */
  points?: number;
  /** Points needed for the next level; omit at the top level. */
  nextLevelPoints?: number | null;
  /** Printed under the barcode on the back of the full card. */
  cardId?: string;
  /** Defaults to `compact`. */
  variant?: FanCardVariant;
  /** Compact card tap, e.g. open the full card. */
  onPress?: () => void;
  /** Without name and surname the card asks to fill the profile; this opens it. */
  onOpenProfile?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type FanCardFrontProps = Pick<
  FanCardProps,
  'name' | 'surname' | 'photo' | 'season' | 'points' | 'nextLevelPoints'
> & {
  level: LoyaltyLevel;
  full: boolean;
};

/** Colours of one loyalty level's card. */
export type LevelLook = {
  /** Horizontal gradient: [colour, stop %]. */
  gradient: [ColorToken, number][];
  /** Level tab and avatar placeholder. */
  ink: ColorToken;
  lion: ColorToken;
  /** Lion face features. */
  face: ColorToken;
  /** Name, season, progress text and bar. */
  text: ColorToken;
};
