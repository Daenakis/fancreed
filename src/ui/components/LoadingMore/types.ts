import type { StyleProp, ViewStyle } from 'react-native';

import type { ColorToken } from '@/ui/theme';

export type LoadingMoreProps = {
  /** Spins while more items are loading; the space stays reserved. */
  loading: boolean;
  /** Theme colour of the spinner. Defaults to `mutedForeground`. */
  color?: ColorToken;
  /** Layout for the end of a horizontal list. Defaults to `false`. */
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
};
