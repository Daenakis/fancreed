import { ICONS } from '@/ui/assets/icons';

import type { IconProps } from './types';

export function Icon({
  name,
  size = 20,
  fill = 'currentColor',
  ...props
}: IconProps) {
  const SvgIcon = ICONS[name];
  if (!SvgIcon) return null;
  return <SvgIcon width={size} height={size} fill={fill} {...props} />;
}
