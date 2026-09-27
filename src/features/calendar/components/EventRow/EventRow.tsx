import { useTranslation } from 'react-i18next';
import { Image, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import type { IconName } from '@/ui/assets/icons';
import { Icon, Text } from '@/ui/components';

import { eventDate, formatEventDate } from '@/utils';

import type { ClubEventKind } from '@/types/api';

import type { EventRowProps } from './types';

const KIND_ICONS: Record<ClubEventKind, IconName> = {
  party: 'party',
  trip: 'bus',
  meeting: 'calendar',
};

/**
 * A fan event in a list: kind icon and name, the number of fans going and,
 * optionally, its date and associated match.
 */
export function EventRow({
  event,
  showDate = false,
  match,
  onPress,
  style,
}: EventRowProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useUnistyles();
  const members = event.members?.length;
  const start = event.startDate ?? event.time;

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[
        t(`events.kind.${event.kind ?? 'meeting'}`),
        showDate && start
          ? formatEventDate(eventDate(start), i18n.language)
          : null,
      ]
        .filter(Boolean)
        .join(', ')}
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
            {t(`events.kind.${event.kind ?? 'meeting'}`)}
          </Text>
          {showDate && start ? (
            <Text variant="bodySRegular" color="mutedForeground">
              {formatEventDate(eventDate(start), i18n.language)}
            </Text>
          ) : null}
        </View>
        {match ? (
          <View style={styles.title}>
            <Text variant="bodySRegular" style={styles.flex}>
              {t('events.associatedMatch')}
            </Text>
            <Image
              source={{ uri: match.homeTeam.logo }}
              accessibilityLabel={match.homeTeam.name}
              style={styles.crest}
            />
            <Text variant="bodySRegular" color="mutedForeground">
              —
            </Text>
            <Image
              source={{ uri: match.awayTeam.logo }}
              accessibilityLabel={match.awayTeam.name}
              style={styles.crest}
            />
          </View>
        ) : null}
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
  crest: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    resizeMode: 'contain',
  },
  pressed: {
    opacity: 0.7,
  },
}));
