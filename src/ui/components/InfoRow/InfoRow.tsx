import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon } from '../Icon';
import { Text } from '../Text';
import type { InfoRowProps } from './types';

/**
 * Label on the left, value on the right, on a light-green row (player,
 * club and event details). With `onPress` the value is a green link.
 *
 * @example
 * <InfoRow label={t('club.members')} value="15" />
 * <InfoRow label={t('event.address')} value={address} icon="location" onPress={openMap} />
 */
export function InfoRow({ label, value, icon, onPress, style }: InfoRowProps) {
  const { theme } = useUnistyles();
  const link = !!onPress;
  const content = (
    <>
      <Text variant="bodySRegular" style={styles.label}>
        {label}
      </Text>
      <View style={styles.value}>
        <Text
          variant="bodySSemibold"
          color={link ? 'brand' : 'foreground'}
          numberOfLines={2}
          style={styles.valueText}
        >
          {value}
        </Text>
        {icon ? (
          <Icon
            name={icon}
            size={14}
            color={link ? theme.colors.brand : theme.colors.foreground}
          />
        ) : null}
      </View>
    </>
  );

  return link ? (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${label}: ${value}`}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      {content}
    </Pressable>
  ) : (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.row, style]}
    >
      {content}
    </View>
  );
}

InfoRow.displayName = 'InfoRow';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(3),
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.mintSurface,
  },
  label: {
    flexShrink: 0,
  },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  valueText: {
    flexShrink: 1,
    textAlign: 'right',
  },
  pressed: {
    opacity: 0.7,
  },
}));
