import type { StyleProp, ViewStyle } from 'react-native';

import type { Player } from '@/types/api';

export type SquadBlockProps = {
  /** Opens the player's page (`player.ruhLink`). */
  onOpenPlayer: (player: Player) => void;
  style?: StyleProp<ViewStyle>;
};
