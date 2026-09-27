import type { StyleProp, ViewStyle } from 'react-native';

import type { ClubEvent } from '@/types/api';

export type EventRowProps = {
  event: ClubEvent;
  /** Opens the event; the chevron hides without it. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
