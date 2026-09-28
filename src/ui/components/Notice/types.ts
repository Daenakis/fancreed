import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type NoticeProps = {
  text: string;
  /** Defaults to `info`. */
  icon?: IconName;
  /** Text and icon 2 px larger, e.g. on the profile screens. Defaults to `false`. */
  large?: boolean;
  style?: StyleProp<ViewStyle>;
};
