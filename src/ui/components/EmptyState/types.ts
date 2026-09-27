import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type EmptyStateProps = {
  icon: IconName;
  title: string;
  text?: string;
  style?: StyleProp<ViewStyle>;
};
