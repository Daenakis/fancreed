import { Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { MenuRowProps, MenuRowTone } from './types';

/** Tappable settings row: icon, label and an optional value on the right. */
export function MenuRow({
  label,
  icon,
  value,
  tone = 'default',
  chevron = false,
  onPress,
  style,
}: MenuRowProps) {
  const { theme } = useUnistyles();
  const destructive = tone === 'destructive';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}, ${value}` : label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row(tone),
        pressed && styles.pressed,
        style,
      ]}
    >
      <Icon
        name={icon}
        size={18}
        color={destructive ? theme.colors.destructive : theme.colors.brand}
      />
      <Text
        variant={destructive ? 'bodyMSemibold' : 'bodyMRegular'}
        color={destructive ? 'destructive' : 'foreground'}
        style={styles.label}
      >
        {label}
      </Text>
      {value ? <Text variant="bodyMRegular">{value}</Text> : null}
      {chevron ? (
        <Icon
          name="arrowRight"
          size={16}
          color={theme.colors.mutedForeground}
        />
      ) : null}
    </Pressable>
  );
}

MenuRow.displayName = 'MenuRow';

const styles = StyleSheet.create((theme) => ({
  row: (tone: MenuRowTone) => ({
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    backgroundColor:
      tone === 'destructive'
        ? theme.colors.destructiveMuted
        : theme.colors.mintSurface,
  }),
  label: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
}));
