import { Keyboard, Pressable, ScrollView, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { ChoiceGroupProps, ChoiceItemProps, SegmentProps } from './types';

/**
 * Pick exactly one option. `segmented` shows 2–3 joined buttons (selected
 * one filled green, like a selected outline Button); `radio` shows circles
 * with labels, two per row, for polls with more or longer answers; `tabs`
 * shows text tabs with a green underline under the selected one; `list`
 * shows one radio row per option (bottom-sheet pickers); `chips` a scrolling
 * row of pills with icons.
 *
 * @example
 * <ChoiceGroup options={genders} value={gender} onChange={setGender} caption={`${t('profile.gender')} *`} />
 * <ChoiceGroup variant="radio" options={answers} value={answer} onChange={setAnswer} />
 * <ChoiceGroup variant="tabs" options={sections} value={section} onChange={setSection} />
 */
export function ChoiceGroup<T extends string | number>({
  options,
  value,
  onChange,
  variant = 'segmented',
  caption,
  large = false,
  style,
}: ChoiceGroupProps<T>) {
  const radio = variant === 'radio';
  const tabs = variant === 'tabs';
  const list = variant === 'list';
  const chips = variant === 'chips';

  const group = (
    <View
      accessibilityRole={tabs ? 'tablist' : 'radiogroup'}
      accessibilityLabel={caption}
      style={
        radio
          ? styles.radioList
          : tabs
            ? styles.tabRow
            : list
              ? styles.list
              : chips
                ? styles.chipRow
                : styles.segmentRow
      }
    >
      {options.map((option, i) => {
        const common = {
          label: option.label,
          large,
          icon: option.icon,
          selected: option.value === value,
          onPress: () => {
            // Picking an option ends typing in a nearby field.
            Keyboard.dismiss();
            onChange(option.value);
          },
        };
        if (tabs) return <Tab key={String(option.value)} {...common} />;
        if (list) return <ListItem key={String(option.value)} {...common} />;
        if (chips) return <Chip key={String(option.value)} {...common} />;
        return radio ? (
          <RadioItem key={String(option.value)} {...common} />
        ) : (
          <Segment
            key={String(option.value)}
            {...common}
            first={i === 0}
            last={i === options.length - 1}
          />
        );
      })}
    </View>
  );

  return (
    <View style={[styles.container(radio || list || chips), style]}>
      {chips ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {group}
        </ScrollView>
      ) : (
        group
      )}
      {caption ? (
        <Text color="mutedForeground" style={styles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

ChoiceGroup.displayName = 'ChoiceGroup';

function Segment({
  label,
  large,
  selected,
  first,
  last,
  onPress,
}: SegmentProps) {
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
      <Text
        variant={large ? 'h4Regular' : 'bodyLRegular'}
        color={selected ? 'primaryForeground' : 'foreground'}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Tab({ label, selected, onPress }: ChoiceItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.tab(selected), pressed && styles.pressed]}
    >
      <Text
        variant={selected ? 'bodySSemibold' : 'bodySRegular'}
        color={selected ? 'foreground' : 'mutedForeground'}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Chip({ label, large, icon, selected, onPress }: ChoiceItemProps) {
  const { theme } = useUnistyles();
  const color = selected ? theme.colors.onBrand : theme.colors.foreground;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip(selected),
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Icon name={icon} size={16} color={color} /> : null}
      <Text
        variant={large ? 'bodyLRegular' : 'bodyMRegular'}
        color={selected ? 'onBrand' : 'foreground'}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function ListItem({ label, large, selected, onPress }: ChoiceItemProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.listItem(selected),
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.smallCircle(selected)}>
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <Text variant={large ? 'bodyLRegular' : 'bodyMRegular'}>{label}</Text>
    </Pressable>
  );
}

function RadioItem({ label, large, selected, onPress }: ChoiceItemProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.radioItem, pressed && styles.pressed]}
    >
      <View style={styles.circle(selected)}>
        {selected ? <View style={styles.dot} /> : null}
      </View>
      <Text
        variant={large ? 'bodyLRegular' : 'bodyMRegular'}
        style={styles.radioLabel}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: (radio: boolean) => ({
    alignItems: radio ? 'stretch' : 'center',
  }),
  segmentRow: {
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
  tabRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  tab: (selected: boolean) => ({
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing(2),
    borderBottomWidth: 2,
    borderColor: selected ? theme.colors.brand : 'transparent',
  }),
  list: {
    gap: theme.spacing(2),
  },
  chipRow: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  chip: (selected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderWidth: 1,
    borderRadius: theme.radius.md,
    borderColor: selected ? theme.colors.brand : theme.colors.border,
    backgroundColor: selected ? theme.colors.brand : theme.colors.background,
  }),
  listItem: (selected: boolean) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    backgroundColor: selected
      ? theme.colors.mintSurfaceStrong
      : theme.colors.secondary,
  }),
  smallCircle: (selected: boolean) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.full,
    borderColor: selected ? theme.colors.brand : theme.colors.mutedForeground,
    backgroundColor: theme.colors.background,
  }),
  radioList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  circle: (selected: boolean) => ({
    width: theme.spacing(5),
    height: theme.spacing(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: theme.radius.full,
    borderColor: selected ? theme.colors.primary : theme.colors.foreground,
    backgroundColor: theme.colors.background,
  }),
  dot: {
    width: '60%',
    height: '60%',
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  radioLabel: {
    flex: 1,
    marginLeft: theme.spacing(1),
  },
  caption: {
    marginTop: theme.spacing(1),
  },
  pressed: {
    opacity: 0.7,
  },
}));
