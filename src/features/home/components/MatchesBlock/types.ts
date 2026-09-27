import type { StyleProp, ViewStyle } from 'react-native';

export type MatchesBlockProps = {
  /** Opens a match link (tickets, review, video). */
  onOpenLink: (url: string) => void;
  style?: StyleProp<ViewStyle>;
};
