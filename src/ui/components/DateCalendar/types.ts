import type { StyleProp, ViewStyle } from 'react-native';

export type DateCalendarProps = {
  /** Picked day; the view opens on it (or on `initialView` / today). */
  value: Date | null;
  /** Month to open on when there's no value, e.g. 2000 for birthdays. */
  initialView?: Date;
  onChange: (date: Date) => void;
  /** First year in the year list. Defaults to 1920. */
  minYear?: number;
  /** Last year in the year list. Defaults to the current year (or `maxDate`'s). */
  maxYear?: number;
  /** Latest pickable day; later days and months are disabled (e.g. today for birthdays). */
  maxDate?: Date;
  style?: StyleProp<ViewStyle>;
};

/** What the grid shows: days of a month, the 12 months or the years. */
export type CalendarMode = 'day' | 'month' | 'year';

export type HeaderToggleProps = {
  label: string;
  open: boolean;
  dimmed: boolean;
  onPress: () => void;
};

export type GridCellProps = {
  label: string;
  selected: boolean;
  muted?: boolean;
  /** Month/year cell: three per row, framed. */
  wide?: boolean;
  /** Not pickable (after `maxDate`). */
  disabled?: boolean;
  /** Screen-reader name when the label alone is ambiguous (days). */
  accessibilityLabel?: string;
  onPress: () => void;
};
