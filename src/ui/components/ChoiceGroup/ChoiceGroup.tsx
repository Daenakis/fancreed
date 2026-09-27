import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { ChoiceGroupProps, ChoiceItemProps, SegmentProps } from './types';

/**
 * Pick exactly one option. `segmented` shows 2–3 joined buttons (selected
 * one filled green, like a selected outline Button); `radio` shows circles
 * with labels, two per row, for polls with more or longer answers; `tabs`
 * shows text tabs with a green underline under the selected one.
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
  style,
}: ChoiceGroupProps<T>) {
  const radio = variant === 'radio';
  const tabs = variant === 'tabs';

  return (
    <View style={[styles.container(radio), style]}>
      <View
        accessibilityRole={tabs ? 'tablist' : 'radiogroup'}
        accessibilityLabel={caption}
        style={
          radio ? styles.radioList : tabs ? styles.tabRow : styles.segmentRow
        }
      >
        {options.map((option, i) => {
          const common = {
            label: option.label,
            selected: option.value === value,
            onPress: () => onChange(option.value),
          };
          if (tabs) return <Tab key={String(option.value)} {...common} />;
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
      {caption ? (
        <Text color="mutedForeground" style={styles.caption}>
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

ChoiceGroup.displayName = 'ChoiceGroup';

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

function RadioItem({ label, selected, onPress }: ChoiceItemProps) {
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
      <Text variant="bodyMRegular" style={styles.radioLabel}>
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
