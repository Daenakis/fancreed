import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { SegmentedControlProps, SegmentProps } from './types';

/**
 * Pick one of 2–3 options, e.g. gender or club visibility. The selected
 * segment is filled with the primary colour (same look as a selected
 * outline Button); a caption can sit underneath.
 *
 * @example
 * <SegmentedControl
 *   options={[{ label: t('profile.male'), value: 'male' }, { label: t('profile.female'), value: 'female' }]}
 *   value={gender}
 *   onChange={setGender}
 *   caption={`${t('profile.gender')} *`}
 * />
 */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  caption,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={caption}
        style={styles.row}
      >
        {options.map((option, i) => (
          <Segment
            key={String(option.value)}
            label={option.label}
            selected={option.value === value}
            first={i === 0}
            last={i === options.length - 1}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
      {caption ? (
        <Text color="mutedForeground" style={styles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

SegmentedControl.displayName = 'SegmentedControl';

function Segment({ label, selected, first, last, onPress }: SegmentProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.segment(selected, first, last),
        pressed && styles.pressed,
      ]}
    >
      <Text color={selected ? 'primaryForeground' : 'foreground'}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    gap: theme.spacing(2),
  },
  // Outer corners rounded, inner ones square — reads as one control.
  segment: (selected: boolean, first: boolean, last: boolean) => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing(2.5),
    borderWidth: 1,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    borderTopLeftRadius: first ? theme.radius.md : 0,
    borderBottomLeftRadius: first ? theme.radius.md : 0,
    borderTopRightRadius: last ? theme.radius.md : 0,
    borderBottomRightRadius: last ? theme.radius.md : 0,
    backgroundColor: selected ? theme.colors.primary : theme.colors.background,
  }),
  caption: {
    marginTop: theme.spacing(1),
  },
  pressed: {
    opacity: 0.7,
  },
}));
