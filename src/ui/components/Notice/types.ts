import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type NoticeProps = {
  text: string;
  /** Defaults to `info`. */
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};
