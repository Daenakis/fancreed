import type { StyleProp, ViewStyle } from 'react-native';

import type { LineupPlayer } from '@/types/api';

/** A place on the pitch ("row:column", row 1 = goalkeeper), filled or empty. */
export type PitchSlot = {
  grid: string;
  player?: LineupPlayer | null;
};

export type PitchProps = {
  slots: PitchSlot[];
  /** Tap on a place, e.g. open a player page or pick a player. */
  onPressSlot?: (slot: PitchSlot) => void;
  /** Caption of an empty place, e.g. "Choose a player". */
  emptyLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export type PitchPlaceProps = {
  slot: PitchSlot;
  emptyLabel?: string;
  onPress?: (slot: PitchSlot) => void;
};
