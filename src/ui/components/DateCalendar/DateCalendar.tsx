import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { calendarDays, isSameDay } from '@/utils';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type {
  CalendarMode,
  DateCalendarProps,
  GridCellProps,
  HeaderToggleProps,
} from './types';

const MONTHS = Array.from({ length: 12 }, (_, i) => i);

/** Translated name list; numbers as a fallback when it's missing. */
function names(value: unknown, count: number): string[] {
  return Array.isArray(value)
    ? (value as string[])
    : Array.from({ length: count }, (_, i) => String(i + 1));
}

/**
 * Month calendar for picking a day (e.g. a birthday). Tapping the month or
 * the year in the header switches the grid to months or years, so distant
 * dates take three taps.
 *
 * @example
 * <DateCalendar value={birthday} onChange={setBirthday} />
 */
export function DateCalendar({
  value,
  onChange,
  minYear = 1920,
  maxDate,
  maxYear = (maxDate ?? new Date()).getFullYear(),
  initialView,
  style,
}: DateCalendarProps) {
  const { t } = useTranslation();
  const start = value ?? initialView ?? new Date();
  const [mode, setMode] = useState<CalendarMode>('day');
  const { theme } = useUnistyles();
  // One year row: text + cell padding + border + row gap.
  const yearRow =
    theme.typography.bodyMRegular.lineHeight +
    theme.spacing(4) +
    2 +
    theme.spacing(2);
  const [year, setYear] = useState(start.getFullYear());
  const [month, setMonth] = useState(start.getMonth());
  const monthNames = names(t('dates.months', { returnObjects: true }), 12);
  const weekdays = names(t('dates.weekdays', { returnObjects: true }), 7);
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i,
  );

  const toggle = (next: CalendarMode) =>
    setMode((current) => (current === next ? 'day' : next));

  return (
    <View style={style}>
      <View style={styles.header}>
        <HeaderToggle
          label={monthNames[month] ?? ''}
          open={mode === 'month'}
          dimmed={mode === 'year'}
          onPress={() => toggle('month')}
        />
        <HeaderToggle
          label={String(year)}
          open={mode === 'year'}
          dimmed={mode === 'month'}
          onPress={() => toggle('year')}
        />
      </View>

      {mode === 'day' ? (
        <View style={styles.grid}>
          {weekdays.map((day) => (
            <View key={day} style={styles.dayCell}>
              <Text variant="bodySRegular" color="mutedForeground">
                {day}
              </Text>
            </View>
          ))}
          {calendarDays(year, month).map(({ date, inMonth }) => (
            <GridCell
              key={date.toISOString()}
              label={String(date.getDate())}
              accessibilityLabel={`${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`}
              selected={!!value && inMonth && isSameDay(date, value)}
              muted={!inMonth}
              disabled={!!maxDate && date > maxDate}
              onPress={() => onChange(date)}
            />
          ))}
        </View>
      ) : mode === 'month' ? (
        <View style={styles.wideGrid}>
          {MONTHS.map((m) => (
            <GridCell
              key={m}
              label={monthNames[m] ?? ''}
              selected={m === month}
              wide
              disabled={
                !!maxDate &&
                year === maxDate.getFullYear() &&
                m > maxDate.getMonth()
              }
              onPress={() => {
                setMonth(m);
                setMode('day');
              }}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          style={styles.years}
          contentContainerStyle={styles.wideGrid}
          // Opens with the current year two rows from the top.
          contentOffset={{
            x: 0,
            y: Math.max(0, (Math.floor((maxYear - year) / 3) - 2) * yearRow),
          }}
        >
          {years.map((y) => (
            <GridCell
              key={y}
              label={String(y)}
              selected={y === year}
              wide
              onPress={() => {
                setYear(y);
                setMode('day');
              }}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

DateCalendar.displayName = 'DateCalendar';

function HeaderToggle({ label, open, dimmed, onPress }: HeaderToggleProps) {
  const { theme } = useUnistyles();
  const color = dimmed ? theme.colors.mutedForeground : theme.colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ expanded: open }}
      hitSlop={8}
      onPress={onPress}
      style={styles.toggle}
    >
      <Text
        variant="bodyMMedium"
        color={dimmed ? 'mutedForeground' : 'foreground'}
      >
        {label}
      </Text>
      <Icon name={open ? 'arrowUp' : 'arrowDown'} size={14} color={color} />
    </Pressable>
  );
}

function GridCell({
  label,
  selected,
  muted = false,
  wide = false,
  disabled = false,
  accessibilityLabel,
  onPress,
}: GridCellProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.cell(selected, wide),
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant="bodyMRegular"
        color={
          selected
            ? 'onBrand'
            : muted || disabled
              ? 'mutedForeground'
              : 'foreground'
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(3),
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: theme.spacing(2),
  },
  dayCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
  },
  wideGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing(2),
  },
  years: {
    maxHeight: 300,
  },
  cell: (selected: boolean, wide: boolean) => ({
    width: wide ? '31%' : `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing(2),
    borderRadius: theme.radius.sm,
    borderWidth: wide ? 1 : 0,
    borderColor: selected ? theme.colors.brand : theme.colors.border,
    backgroundColor: selected ? theme.colors.brand : 'transparent',
  }),
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
}));
