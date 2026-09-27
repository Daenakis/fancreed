import type { StyleProp, ViewStyle } from 'react-native';

import type { Player } from '@/types/api';

export type SquadBlockProps = {
  /** Opens the centred player's page. */
  onOpenPlayer: (player: Player) => void;
  style?: StyleProp<ViewStyle>;
};
