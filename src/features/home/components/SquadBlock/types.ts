import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { Player } from '@/types/api';

export type SquadBlockProps = {
  /** "Show more" opens the centred player's page. */
  onOpenPlayer?: (player: Player) => void;
  /** Defaults to "Squad". */
  title?: string;
  /** Player (`_id`) to centre first, e.g. the fan's favourite. */
  initialPlayerId?: string;
  /** Replaces the "Show more" button; gets the centred player. */
  renderAction?: (player: Player) => ReactNode;
  /** Light-green card look (profile). Defaults to `false`. */
  boxed?: boolean;
  style?: StyleProp<ViewStyle>;
};
