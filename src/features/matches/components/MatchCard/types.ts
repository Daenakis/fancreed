import type { StyleProp, ViewStyle } from 'react-native';

import type { Fixture } from '@/types/api';

/**
 * - `full` (default): home-screen card with countdown and links.
 * - `compact`: light-green calendar card — events, video, tickets buttons.
 */
export type MatchCardVariant = 'full' | 'compact';

export type MatchCardProps = {
  match: Fixture;
  /** Defaults to `full`. */
  variant?: MatchCardVariant;
  /** Opens a match link (tickets, review, video) — e.g. in a browser. */
  onOpenLink: (url: string) => void;
  /** `full`: "Line-up" opens the line-up screen; disabled without it. */
  onOpenLineup?: (match: Fixture) => void;
  /** "Video" opens the videos screen instead of the link. */
  onOpenVideos?: (match: Fixture) => void;
  /** `compact`: heading instead of the league name, e.g. league + season. */
  title?: string;
  /** `compact`: shows the share icon and the Events/Video/Tickets row. Defaults to `true`. */
  actions?: boolean;
  /** `compact`: "Events" opens the match's fan events; disabled without it. */
  onOpenEvents?: (match: Fixture) => void;
  style?: StyleProp<ViewStyle>;
};

/** One button in the full card's link row. */
export type MatchLinkItem = {
  label: string;
  /** Missing = the button is disabled. */
  onPress?: () => void;
  /** The filled (white) button, e.g. tickets. */
  primary?: boolean;
};

export type ChipProps = {
  text: string;
};

export type MatchVariantProps = Omit<MatchCardProps, 'variant'>;
