import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Carousel, LoadingMore, SectionTitle } from '@/ui/components';

import { useClubEventsQuery } from '@/hooks';

import { EventRow } from '@/features/calendar';

import type { ClubEventsBlockProps } from './types';

const PAGE = 3;

/**
 * "Fan events": club events as rows (kind, members), three per page;
 * "+" in the title creates one when the fan owns a club.
 */
export function ClubEventsBlock({
  onOpenEvent,
  onCreateEvent,
  style,
}: ClubEventsBlockProps) {
  const { t } = useTranslation();
  const { data: events, isPending } = useClubEventsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!events?.length && !onCreateEvent) return null;

  const pages = Array.from(
    { length: Math.ceil((events?.length ?? 0) / PAGE) },
    (_, i) => events!.slice(i * PAGE, i * PAGE + PAGE),
  );

  return (
    <View style={style}>
      <SectionTitle
        title={t('club.eventsTitle')}
        action={
          onCreateEvent
            ? {
                icon: 'plus',
                label: t('club.createEvent'),
                onPress: onCreateEvent,
              }
            : undefined
        }
      />
      {pages.length ? (
        <Carousel
          data={pages}
          itemWidthRatio={0.9}
          keyExtractor={(page) => page[0]!._id}
          renderItem={(page) => (
            <View style={styles.page}>
              {page.map((event) => (
                <EventRow
                  key={event._id}
                  event={event}
                  onPress={() => onOpenEvent(event)}
                />
              ))}
            </View>
          )}
        />
      ) : null}
    </View>
  );
}

ClubEventsBlock.displayName = 'ClubEventsBlock';

const styles = StyleSheet.create((theme) => ({
  page: {
    gap: theme.spacing(2),
  },
}));
