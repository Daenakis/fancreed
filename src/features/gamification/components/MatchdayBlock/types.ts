import type { StyleProp, ViewStyle } from 'react-native';

import type { AppEvent } from '@/types/api';

export type MatchdayBlockProps = {
  /** Opens a URL (the event location in a maps app). */
  onOpenLink: (url: string) => void;
  /** Adds the event to the phone calendar; the button is hidden without it. */
  onRemind?: (event: AppEvent) => void;
  style?: StyleProp<ViewStyle>;
};
