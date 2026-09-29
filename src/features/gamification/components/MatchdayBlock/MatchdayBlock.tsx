import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Share, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Icon, Skeleton, Text } from '@/ui/components';

import { useCalendarReminder, useMatchdayEventsQuery } from '@/hooks';

import { eventDate, hasEventDay, mapsUrl } from '@/utils';

import type { AppEvent } from '@/types/api';

import { useMatchdayJoins } from '../../hooks';
import { ReminderSheet } from '../ReminderSheet';
import type {
  ActionTileProps,
  MatchdayBlockProps,
  MatchdayEventProps,
} from './types';

/** Events shown before "show more". */
const COLLAPSED = 2;

/**
 * Matchday: the club's official events of the match day on a green block —
 * when and where, with Share, Remind (adds it to the calendar), Location
 * and Join. Hidden when there are no events.
 */
export function MatchdayBlock({ onOpenLink, style }: MatchdayBlockProps) {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const { data: events, isPending } = useMatchdayEventsQuery();
  const { isJoined, toggle } = useMatchdayJoins();
  const remind = useCalendarReminder();
  const [expanded, setExpanded] = useState(false);
  const [reminding, setReminding] = useState<AppEvent | null>(null);

  if (isPending) {
    // Same band as one loaded event, so the page doesn't jump when it arrives.
    return (
      <View style={[styles.block, style]}>
        <Skeleton
          width={theme.spacing(20)}
          height={theme.spacing(5.5)}
          color="brandBorder"
        />
        <View style={styles.head}>
          <View style={styles.lines}>
            <Skeleton
              width="90%"
              height={theme.spacing(4)}
              color="brandBorder"
            />
            <Skeleton
              width="60%"
              height={theme.spacing(4)}
              color="brandBorder"
            />
          </View>
          <Skeleton
            width={theme.spacing(16)}
            height={theme.spacing(6)}
            color="brandBorder"
          />
        </View>
        <View style={styles.actions}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              height={theme.spacing(12.5)}
              color="brandBorder"
              style={styles.tile}
            />
          ))}
        </View>
      </View>
    );
  }
  if (!events?.length) return null;
  const shown = expanded ? events : events.slice(0, COLLAPSED);

  const confirmReminder = async (minutesBefore: number) => {
    const event = reminding;
    setReminding(null);
    if (!event) return;
    const result = await remind({
      title: event.title,
      start: eventDate(event.time),
      location: event.location,
      minutesBefore,
    });
    Alert.alert(t(`reminder.${result}`));
  };

  return (
    <View style={[styles.block, style]}>
      <View style={styles.badge}>
        <Text variant="bodySSemibold" color="onHighlight">
          {t('event.matchdayTitle')}
        </Text>
      </View>
      {shown.map((event) => (
        <MatchdayEvent
          key={event._id}
          event={event}
          joined={isJoined(event._id)}
          onToggleJoin={() => toggle(event._id)}
          onRemind={() => setReminding(event)}
          onOpenLink={onOpenLink}
        />
      ))}
      {events.length > COLLAPSED ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(expanded ? 'event.showLess' : 'event.showMore')}
          hitSlop={8}
          onPress={() => setExpanded((e) => !e)}
          style={styles.more}
        >
          <Icon
            name={expanded ? 'arrowUp' : 'arrowDown'}
            size={18}
            color={theme.colors.onBrand}
          />
        </Pressable>
      ) : null}
      {reminding ? (
        <ReminderSheet
          visible
          onClose={() => setReminding(null)}
          start={eventDate(reminding.time)}
          onConfirm={(minutes) => void confirmReminder(minutes)}
        />
      ) : null}
    </View>
  );
}

MatchdayBlock.displayName = 'MatchdayBlock';

function MatchdayEvent({
  event,
  joined,
  onToggleJoin,
  onRemind,
  onOpenLink,
}: MatchdayEventProps) {
  const { t, i18n } = useTranslation();
  const start = eventDate(event.time);
  const time = Number.isNaN(start.getTime())
    ? ''
    : new Intl.DateTimeFormat(i18n.language, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(start);

  const share = () =>
    void Share.share({
      message: t('event.shareMessage', {
        title: event.title,
        date: time,
        location: event.location,
      }),
    });

  return (
    <View style={styles.event}>
      <View style={styles.head}>
        <Text variant="bodyLRegular" color="onBrand" style={styles.title}>
          {event.title}
        </Text>
        <View style={styles.when}>
          <Text variant="h4Medium" color="onBrand">
            {time}
          </Text>
          {event.location ? (
            <Text
              variant="bodyXSMedium"
              color="brandMutedForeground"
              numberOfLines={1}
            >
              {event.location}
            </Text>
          ) : null}
        </View>
      </View>
      <View style={styles.actions}>
        <ActionTile icon="telegram" label={t('event.share')} onPress={share} />
        {/* Clock-only events have no day to put in the calendar. */}
        {hasEventDay(event.time) ? (
          <ActionTile
            icon="bell"
            label={t('event.remind')}
            onPress={onRemind}
          />
        ) : null}
        {event.location || event.coords ? (
          <ActionTile
            icon="location"
            label={t('event.location')}
            onPress={() => onOpenLink(mapsUrl(event))}
          />
        ) : null}
        <ActionTile
          icon={joined ? 'userMinus' : 'userPlus'}
          label={t(joined ? 'event.leave' : 'event.join')}
          onPress={onToggleJoin}
        />
      </View>
    </View>
  );
}

function ActionTile({ icon, label, onPress }: ActionTileProps) {
  const { theme } = useUnistyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
    >
      <Icon name={icon} size={16} color={theme.colors.brand} />
      <Text variant="bodyXSMedium" color="brand" numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  block: {
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: theme.colors.brand,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(0.5),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.highlight,
  },
  event: {
    gap: theme.spacing(3),
  },
  head: {
    flexDirection: 'row',
    gap: theme.spacing(3),
  },
  title: {
    flex: 1,
  },
  lines: {
    flex: 1,
    gap: theme.spacing(2),
  },
  when: {
    alignItems: 'flex-end',
    maxWidth: '35%',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: theme.spacing(1),
    paddingVertical: theme.spacing(2),
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.background,
  },
  more: {
    alignSelf: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
}));
