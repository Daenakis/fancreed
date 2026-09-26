import type { StyleProp, ViewStyle } from 'react-native';

export type LoyaltyLevel = 'bronze' | 'silver' | 'gold';

/**
 * - `compact` (default): banner on the home screen.
 * - `full`: large bordered card (landscape view); tapping flips it to the
 *   barcode side.
 */
export type FanCardVariant = 'compact' | 'full';

export type FanCardProps = {
  name?: string | null;
  surname?: string | null;
  /** Photo URL. Without name, surname and photo the "fill your profile" state shows. */
  photo?: string | null;
  /** Current season, e.g. "2025/2026". */
  season: string;
  /** Not in the backend yet — falls back to bronze, as in the old app. */
  loyaltyLevel?: LoyaltyLevel;
  /** Defaults to `compact`. */
  variant?: FanCardVariant;
  /** Header text. Defaults to "FAN CARD". */
  title?: string;
  /** Opens the profile (photo tap and the empty-state button). */
  onOpenProfile?: () => void;
  style?: StyleProp<ViewStyle>;
};

export type FanCardFrontProps = Pick<
  FanCardProps,
  'name' | 'surname' | 'photo' | 'season' | 'onOpenProfile'
> & {
  level: LoyaltyLevel;
  full: boolean;
};
