import type { StyleProp, ViewStyle } from 'react-native';

import type { Fixture } from '@/types/api';

export type MatchCardProps = {
  match: Fixture;
  /** Opens a match link (tickets, review, video) — e.g. in a browser. */
  onOpenLink: (url: string) => void;
  style?: StyleProp<ViewStyle>;
};

export type MatchLinkProps = {
  label: string;
  url?: string | null;
  onOpenLink: (url: string) => void;
};
