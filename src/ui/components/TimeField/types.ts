import type { StyleProp, ViewStyle } from 'react-native';

export type TimeFieldProps = {
  label: string;
  /** "HH:MM", or null while not picked. */
  value: string | null | undefined;
  onChange: (time: string) => void;
  error?: string;
  shakeKey?: number;
  /** Heading of the sheet, e.g. "Choose a time". */
  sheetTitle?: string;
  /** Pickable times. Defaults to every 30 minutes from 08:00 to 23:30. */
  slots?: string[];
  /** Times that can't be picked (e.g. already past today). */
  isDisabled?: (time: string) => boolean;
  style?: StyleProp<ViewStyle>;
};

export type TimeSlotProps = {
  time: string;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};
