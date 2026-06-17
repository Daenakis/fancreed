import type { SvgProps } from 'react-native-svg';

import type { IconName } from '@/ui/assets/icons';

export type IconProps = {
  name: IconName;
  size?: number;
} & Omit<SvgProps, 'width' | 'height'>;
