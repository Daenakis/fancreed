import type { StyleProp, ViewStyle } from 'react-native';

import type { ClubEvent } from '@/types/api';

export type ClubEventsBlockProps = {
  onOpenEvent: (event: ClubEvent) => void;
  /** Shows a "+" tile (the fan owns a club and can add events). */
  onCreateEvent?: () => void;
  style?: StyleProp<ViewStyle>;
};
