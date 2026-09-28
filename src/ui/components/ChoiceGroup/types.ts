import type { StyleProp, ViewStyle } from 'react-native';

import type { IconName } from '@/ui/assets/icons';

export type ChoiceOption<T extends string | number> = {
  label: string;
  value: T;
  /** `chips` only: icon before the label. */
  icon?: IconName;
};

/**
 * - `segmented` (default): 2–3 options side by side as joined buttons
 *   (gender, club visibility).
 * - `radio`: circle + label per option, two per row, labels may wrap
 *   (poll answers).
 * - `tabs`: text tabs with an underline under the selected one (screen
 *   sections, e.g. upcoming matches / results).
 * - `list`: one full-width radio row per option (bottom-sheet pickers, e.g.
 *   clothing size).
 * - `chips`: a horizontally scrolling row of pills with optional icons
 *   (event type).
 */
export type ChoiceGroupVariant =
  | 'segmented'
  | 'radio'
  | 'tabs'
  | 'list'
  | 'chips';

export type ChoiceGroupProps<T extends string | number> = {
  options: ChoiceOption<T>[];
  /** Selected value; nothing is selected when it matches no option. */
  value: T | null | undefined;
  onChange: (value: T) => void;
  /** Defaults to `segmented`. */
  variant?: ChoiceGroupVariant;
  /** Caption under the group, e.g. "Gender *". */
  caption?: string;
  /** Option labels 2 px larger, e.g. on the profile screens. Defaults to `false`. */
  large?: boolean;
  style?: StyleProp<ViewStyle>;
};

export type ChoiceItemProps = {
  label: string;
  /** Larger label (see ChoiceGroup `large`). */
  large?: boolean;
  icon?: IconName;
  selected: boolean;
  onPress: () => void;
};

export type SegmentProps = ChoiceItemProps & {
  first: boolean;
  last: boolean;
};
