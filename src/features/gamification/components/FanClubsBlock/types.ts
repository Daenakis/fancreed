import type { StyleProp, ViewStyle } from 'react-native';

import type { Club } from '@/types/api';

export type FanClubsBlockProps = {
  onOpenClub: (club: Club) => void;
  /** Shows a "+" tile (the fan has no club yet). */
  onCreateClub?: () => void;
  style?: StyleProp<ViewStyle>;
};
