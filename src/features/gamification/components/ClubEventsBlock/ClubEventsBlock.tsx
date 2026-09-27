import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { BlockHeader, LoadingMore, TileCarousel } from '@/ui/components';

import { useClubEventsQuery } from '@/hooks';

import type { ClubEventKind } from '@/types/api';

import type { ClubEventsBlockProps } from './types';

/** Illustration per event kind (the old app's artwork). */
const KIND_IMAGES: Record<ClubEventKind, number> = {
  party: require('../../../../../assets/images/event-kinds/party.png'),
  trip: require('../../../../../assets/images/event-kinds/trip.png'),
  meeting: require('../../../../../assets/images/event-kinds/meeting.png'),
};

/** Fan-club events as tiles; "+" adds an event when the fan owns a club. */
export function ClubEventsBlock({
  onOpenEvent,
  onCreateEvent,
  style,
}: ClubEventsBlockProps) {
  const { t } = useTranslation();
  const { data: events, isPending } = useClubEventsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!events?.length && !onCreateEvent) return null;

  return (
    <View style={[styles.container, style]}>
      <BlockHeader title={t('club.eventsTitle')} />
      <TileCarousel
        items={(events ?? []).map((event) => ({
          key: event._id,
          title: event.title,
          image: KIND_IMAGES[event.kind ?? 'trip'],
          event,
        }))}
        onPressItem={(item) => onOpenEvent(item.event)}
        onAdd={onCreateEvent}
        addLabel={t('club.createEvent')}
        tileSurface="muted"
        style={styles.tiles}
      />
    </View>
  );
}

ClubEventsBlock.displayName = 'ClubEventsBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  tiles: {
    alignSelf: 'stretch',
    marginTop: theme.spacing(3),
  },
}));
