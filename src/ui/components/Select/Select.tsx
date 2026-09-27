import { useState } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { BottomSheet } from '../BottomSheet';
import { Icon } from '../Icon';
import { Text } from '../Text';
import type { SelectOptionProps, SelectProps } from './types';

/**
 * Dropdown field: shows the picked option; tapping it opens a bottom sheet
 * with all options (picked one highlighted). Picking closes the sheet.
 *
 * @example
 * <Select label={t('tournament.league')} options={leagues} value={leagueId} onChange={setLeagueId} />
 */
export function Select<T extends string | number>({
  options,
  value,
  onChange,
  label,
  placeholder,
  style,
}: SelectProps<T>) {
  const { theme } = useUnistyles();
  const [open, setOpen] = useState(false);
  const picked = options.find((option) => option.value === value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: picked?.label ?? '' }}
        onPress={() => {
          Keyboard.dismiss();
          setOpen(true);
        }}
        style={({ pressed }) => [
          styles.field,
          pressed && styles.pressed,
          style,
        ]}
      >
        <Text
          variant="bodyMRegular"
          color={picked ? 'foreground' : 'mutedForeground'}
          numberOfLines={1}
          style={styles.value}
        >
          {picked?.label ?? placeholder}
        </Text>
        <Icon name="arrowDown" size={16} color={theme.colors.mutedForeground} />
      </Pressable>
      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel={label}
          style={styles.list}
        >
          {options.map((option) => (
            <SelectOption
              key={String(option.value)}
              label={option.label}
              selected={option.value === value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
}

Select.displayName = 'Select';

function SelectOption({ label, selected, onPress }: SelectOptionProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option(selected),
        pressed && styles.pressed,
      ]}
    >
      <Text variant="bodyMRegular">{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    minHeight: theme.spacing(11),
    paddingHorizontal: theme.spacing(3),
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  value: {
    flex: 1,
  },
  list: {
    gap: theme.spacing(2),
  },
  option: (selected: boolean) => ({
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    backgroundColor: selected
      ? theme.colors.mintSurfaceStrong
      : theme.colors.secondary,
  }),
  pressed: {
    opacity: 0.7,
  },
}));
