import { useTranslation } from 'react-i18next';
import { Share, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BlockHeader, Button, LoadingMore, Text } from '@/ui/components';

import { useMatchdayEventsQuery } from '@/hooks';

import { eventDate, mapsUrl } from '@/utils';

import type { MatchdayBlockProps } from './types';

/**
 * The latest matchday event: when, what and where, with Share, Location
 * (opens a maps app) and — when the screen supports it — Remind.
 */
export function MatchdayBlock({
  onOpenLink,
  onRemind,
  style,
}: MatchdayBlockProps) {
  const { t, i18n } = useTranslation();
  const { data: events, isPending } = useMatchdayEventsQuery();

  if (isPending) return <LoadingMore loading />;
  const event = events?.at(-1);
  if (!event) return null;

  const date = new Intl.DateTimeFormat(i18n.language, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(eventDate(event.time));

  const share = () =>
    void Share.share({
      message: t('event.shareMessage', {
        title: event.title,
        date,
        location: event.location,
      }),
    });

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('event.matchdayTitle')} />
      <View style={styles.card}>
        <Text variant="h3Medium" style={styles.centered}>
          {event.title}
        </Text>
        <Text variant="bodyLMedium" color="primary">
          {date}
        </Text>
        <Text color="mutedForeground" style={styles.centered}>
          {event.location}
        </Text>
        <View style={styles.actions}>
          <Button
            variant="ghost"
            icon="telegram"
            iconPosition="top"
            text={t('event.share')}
            onPress={share}
          />
          {onRemind ? (
            <Button
              variant="ghost"
              icon="bell"
              iconPosition="top"
              text={t('event.remind')}
              onPress={() => onRemind(event)}
            />
          ) : null}
          {event.location || event.coords ? (
            <Button
              variant="ghost"
              icon="location"
              iconPosition="top"
              text={t('event.location')}
              onPress={() => onOpenLink(mapsUrl(event))}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

MatchdayBlock.displayName = 'MatchdayBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  card: {
    alignItems: 'center',
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(6),
    paddingTop: theme.spacing(4),
  },
  centered: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
}));
