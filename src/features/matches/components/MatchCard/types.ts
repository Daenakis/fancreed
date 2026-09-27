import type { StyleProp, ViewStyle } from 'react-native';

import type { Fixture } from '@/types/api';

/**
 * - `full` (default): home-screen card with countdown and links.
 * - `compact`: calendar row — team names, score or date/time, icon actions.
 */
export type MatchCardVariant = 'full' | 'compact';

export type MatchCardProps = {
  match: Fixture;
  /** Defaults to `full`. */
  variant?: MatchCardVariant;
  /** Opens a match link (tickets, review, video) — e.g. in a browser. */
  onOpenLink: (url: string) => void;
  style?: StyleProp<ViewStyle>;
};

export type MatchLinkProps = {
  label: string;
  url?: string | null;
  onOpenLink: (url: string) => void;
};

export type MatchVariantProps = Omit<MatchCardProps, 'variant'>;

export type TeamProps = {
  name: string;
  logo: string;
};
