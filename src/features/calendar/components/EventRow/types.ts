import type { StyleProp, ViewStyle } from 'react-native';

import type { ClubEvent, Fixture } from '@/types/api';

export type EventRowProps = {
  event: ClubEvent;
  /** Shows the start date on the right. */
  showDate?: boolean;
  /** The associated match: "Associated match" with both crests. */
  match?: Fixture | null;
  /** Opens the event; the chevron hides without it. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
