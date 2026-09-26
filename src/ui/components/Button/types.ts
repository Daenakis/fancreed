import type { Ref } from 'react';
import type {
  ImageSourcePropType,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import type { IconName } from '@/ui/assets/icons';
import type { ColorToken } from '@/ui/theme';

/**
 * - `solid` (default): filled action button.
 * - `outline`: bordered, background-coloured; with `selected` it becomes a
 *   filled choice (e.g. one option in a list).
 * - `brand`: for brand-green screens (auth) — white when active, dark green
 *   when disabled.
 * - `ghost`: no background or border, e.g. small icon actions (Share, Remind).
 */
export type ButtonVariant = 'solid' | 'outline' | 'brand' | 'ghost';

export type ButtonSize = 'md' | 'sm';

export type ButtonProps = Omit<
  PressableProps,
  'children' | 'style' | 'disabled'
> & {
  /** Button label. */
  text: string;
  /** Defaults to `solid`. */
  variant?: ButtonVariant;
  /** `md` (default, 48 px high) or compact `sm` with a bolder label. */
  size?: ButtonSize;
  /** Image before the label (24×24), e.g. a club logo. */
  image?: ImageSourcePropType;
  /** Icon from the app icon set, tinted like the label. */
  icon?: IconName;
  /** Where the icon goes: `top` stacks it above a small caption. Defaults to `left`. */
  iconPosition?: 'left' | 'right' | 'top';
  /** Choice state; fills an `outline` button. Defaults to `false`. */
  selected?: boolean;
  /** Spinner instead of the label; blocks presses. Defaults to `false`. */
  loading?: boolean;
  /** Blocks presses and shows the disabled look. Defaults to `false`. */
  disabled?: boolean;
  /** Stretch to the parent's width. Defaults to `false` (fits the label). */
  fullWidth?: boolean;
  /** `solid` only: theme colour of the button. Defaults to `foreground`. */
  backgroundColor?: ColorToken;
  /** `solid`/`ghost`: theme colour of the label. Defaults to `background` (solid) or `foreground` (ghost). */
  textColor?: ColorToken;
  style?: StyleProp<ViewStyle>;
  ref?: Ref<View>;
};
