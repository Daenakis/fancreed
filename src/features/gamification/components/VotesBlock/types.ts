import type { StyleProp, ViewStyle } from 'react-native';

export type VotesBlockProps = {
  /** Team names for the share message. */
  homeTeam?: string;
  awayTeam?: string;
  style?: StyleProp<ViewStyle>;
};
