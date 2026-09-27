import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, View } from 'react-native';

import { formatDayMonthYear } from '@/utils';

import { BottomSheet } from '../BottomSheet';
import { DateCalendar } from '../DateCalendar';
import { TextInput } from '../TextInput';
import type { DateFieldProps } from './types';

/**
 * Looks like a text field ("00/00/0000"); tapping opens the calendar in a
 * bottom sheet. Picking a day closes it.
 *
 * @example
 * <DateField label={t('profile.birthDay')} value={date} onChange={setDate} maxDate={new Date()} />
 */
export function DateField({
  label,
  value,
  onChange,
  error,
  shakeKey,
  initialView,
  minDate,
  maxDate,
  style,
}: DateFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ? formatDayMonthYear(value) : '' }}
        onPress={() => {
          Keyboard.dismiss();
          setOpen(true);
        }}
      >
        {/* The field only displays the value; taps go to the Pressable. */}
        <View pointerEvents="none">
          <TextInput
            label={label}
            placeholder={t('profile.datePlaceholder')}
            value={value ? formatDayMonthYear(value) : ''}
            error={error}
            shakeKey={shakeKey}
          />
        </View>
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <DateCalendar
          value={value ?? null}
          initialView={initialView}
          minDate={minDate}
          maxDate={maxDate}
          onChange={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </BottomSheet>
    </View>
  );
}

DateField.displayName = 'DateField';
