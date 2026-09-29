import type { StyleProp, ViewStyle } from 'react-native';

import type { LineupPrediction, Player } from '@/types/api';

export type LineupPredictionBlockProps = {
  style?: StyleProp<ViewStyle>;
};

export type PlayerPickerProps = {
  visible: boolean;
  onClose: () => void;
  players: Player[];
  /** Player ids already placed elsewhere — hidden from the list. */
  takenIds: string[];
  selectedId?: string;
  onPick: (player: Player) => void;
};

export type SavedPredictionProps = {
  prediction: LineupPrediction;
};
