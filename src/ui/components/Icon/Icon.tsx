import { useUnistyles } from 'react-native-unistyles';

import { ICONS } from '@/ui/assets/icons';

import type { IconProps } from './types';

/**
 * Renders an icon from the ICONS registry.
 * Icons use `currentColor`, so `color` tints strokes and fills.
 * Defaults to the theme foreground so icons follow light/dark mode.
 * Multi-colour brand icons (google, facebook) ignore `color`.
 */
export function Icon({ name, size = 20, color, ...props }: IconProps) {
  const { theme } = useUnistyles();
  const SvgIcon = ICONS[name];

  if (!SvgIcon) return null;

  return (
    <SvgIcon
      width={size}
      height={size}
      color={color ?? theme.colors.foreground}
      {...props}
    />
  );
}
