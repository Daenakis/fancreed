import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { IconName } from '@/ui/assets/icons';
import { Icon, Text } from '@/ui/components';

import type { ClubEventKind } from '@/types/api';

import type { EventRowProps } from './types';

const KIND_ICONS: Record<ClubEventKind, IconName> = {
  party: 'party',
  trip: 'bus',
  meeting: 'calendar',
};

/** A fan event in a list: kind icon, title and the number of fans going. */
export function EventRow({ event, onPress, style }: EventRowProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const members = event.members?.length;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed, style]}
    >
      <View style={styles.text}>
        <View style={styles.title}>
          <Icon
            name={KIND_ICONS[event.kind ?? 'meeting']}
            size={18}
            color={theme.colors.brand}
          />
          <Text variant="bodyMMedium" numberOfLines={1} style={styles.flex}>
            {event.title}
          </Text>
        </View>
        {members !== undefined ? (
          <Text variant="bodySRegular" color="mutedForeground">
            {t('events.members', { count: members })}
          </Text>
        ) : null}
      </View>
      {onPress ? (
        <Icon
          name="arrowRight"
          size={16}
          color={theme.colors.mutedForeground}
        />
      ) : null}
    </Pressable>
  );
}

EventRow.displayName = 'EventRow';

const styles = StyleSheet.create((theme) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.mintSurface,
  },
  text: {
    flex: 1,
    gap: theme.spacing(1.5),
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  flex: {
    flex: 1,
  },
  pressed: {
    opacity: 0.7,
  },
}));
