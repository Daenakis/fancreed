import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import { EmptyState, PageLayout, PageLoader } from '@/ui/components';

import { useClubEventsQuery } from '@/hooks';

import { goBack } from '@/utils';

import { EventRow } from '../../components';

/** Fan-club events organised around one match (club events with its `fixture`). */
export function MatchEventsScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: events, isPending } = useClubEventsQuery();
  const matchEvents = events?.filter((e) => String(e.fixture) === id) ?? [];

  return (
    <PageLayout
      title={t('match.events')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      {isPending ? (
        <PageLoader />
      ) : matchEvents.length ? (
        // TODO: open the event once its screen is designed.
        matchEvents.map((event) => <EventRow key={event._id} event={event} />)
      ) : (
        <EmptyState
          icon="party"
          title={t('lineup.emptyTitle')}
          text={t('events.emptyText')}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(2),
    paddingHorizontal: theme.spacing(4),
  },
}));
