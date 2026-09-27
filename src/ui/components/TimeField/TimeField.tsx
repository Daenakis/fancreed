import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BottomSheet } from '../BottomSheet';
import { Text } from '../Text';
import { TextInput } from '../TextInput';
import type { TimeFieldProps, TimeSlotProps } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

/** Every 30 minutes from 08:00 to 23:30. */
const DEFAULT_SLOTS = Array.from({ length: 32 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
});

/**
 * Looks like a text field ("00:00"); tapping opens a grid of time slots in
 * a bottom sheet. Picking a slot closes it.
 *
 * @example
 * <TimeField label={t('event.time')} value={time} onChange={setTime} sheetTitle={t('event.pickTime')} />
 */
export function TimeField({
  label,
  value,
  onChange,
  error,
  shakeKey,
  sheetTitle,
  slots = DEFAULT_SLOTS,
  isDisabled,
  style,
}: TimeFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ?? '' }}
        onPress={() => {
          Keyboard.dismiss();
          setOpen(true);
        }}
      >
        <View pointerEvents="none">
          <TextInput
            label={label}
            placeholder="00:00"
            value={value ?? ''}
            error={error}
            shakeKey={shakeKey}
          />
        </View>
      </Pressable>
      <BottomSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={sheetTitle}
      >
        <ScrollView style={styles.scroll} contentContainerStyle={styles.grid}>
          {slots.map((time) => (
            <TimeSlot
              key={time}
              time={time}
              selected={time === value}
              disabled={isDisabled?.(time) ?? false}
              onPress={() => {
                onChange(time);
                setOpen(false);
              }}
            />
          ))}
        </ScrollView>
      </BottomSheet>
    </View>
  );
}

TimeField.displayName = 'TimeField';

function TimeSlot({ time, selected, disabled, onPress }: TimeSlotProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={time}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.slot(selected),
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        variant="bodyMRegular"
        color={
          selected ? 'onBrand' : disabled ? 'mutedForeground' : 'foreground'
        }
      >
        {time}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  scroll: {
    maxHeight: 320,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: theme.spacing(2),
  },
  slot: (selected: boolean) => ({
    width: '31%',
    alignItems: 'center',
    paddingVertical: theme.spacing(2),
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    borderColor: selected ? theme.colors.brand : theme.colors.border,
    backgroundColor: selected ? theme.colors.brand : theme.colors.background,
  }),
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
}));
