import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type InfoRowProps = {
  label: string;
  value: string;
  /** Icon after the value, e.g. `location` for an address. */
  icon?: IconName;
  /** Makes the value a green link, e.g. open the address in maps. */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};
