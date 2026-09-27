import type { StyleProp, ViewStyle } from 'react-native';

import type { Club } from '@/types/api';

export type FanClubsBlockProps = {
  onOpenClub: (club: Club) => void;
  /** Shows a "+" tile to create a club. */
  onCreateClub?: () => void;
  style?: StyleProp<ViewStyle>;
};
