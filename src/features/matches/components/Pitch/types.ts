import type { StyleProp, ViewStyle } from 'react-native';

import type { LineupPlayer } from '@/types/api';

export type PitchProps = {
  /** Starting XI with `grid` positions. */
  players: LineupPlayer[];
  /** Tap on a player, e.g. open the player page. */
  onPressPlayer?: (player: LineupPlayer) => void;
  style?: StyleProp<ViewStyle>;
};

export type PitchPlayerProps = {
  player: LineupPlayer;
  onPress?: (player: LineupPlayer) => void;
};
