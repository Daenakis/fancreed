import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Linking, RefreshControl, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { ChoiceGroup, EmptyState, LoadingMore } from '@/ui/components';

import { useFixturesTableQuery } from '@/hooks';

import { matchPhase } from '@/utils';

import { MatchCard } from '@/features/matches';
import { ShellHeader } from '@/features/shell';

import type { CalendarSection } from './types';

// TODO: open links in an in-app browser once one is approved (expo-web-browser).
const openLink = (url: string) => void Linking.openURL(url);

/**
 * Calendar tab: upcoming matches and results of the main team as cards
 * with events, video and tickets. Pull down to refresh.
 */
export function CalendarScreen() {
  const { t } = useTranslation();
  const { theme } = useUnistyles();
  const [section, setSection] = useState<CalendarSection>('upcoming');
  const { data, isPending, isRefetching, refetch } = useFixturesTableQuery();
  // The backend's "future" list starts with the last played match.
  const matches =
    section === 'upcoming'
      ? (data?.future.filter((m) => matchPhase(m.status) !== 'finished') ?? [])
      : (data?.past ?? []);

  return (
    <View style={styles.root}>
      <ShellHeader />
      <ChoiceGroup
        variant="tabs"
        options={[
          { label: t('calendar.upcoming'), value: 'upcoming' },
          { label: t('calendar.results'), value: 'results' },
        ]}
        value={section}
        onChange={setSection}
        style={styles.tabs}
      />
      {isPending ? (
        <LoadingMore loading />
      ) : (
        <FlatList
          data={matches}
          keyExtractor={(match) => String(match._id)}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.brand}
            />
          }
          renderItem={({ item }) => (
            <MatchCard
              variant="compact"
              match={item}
              onOpenLink={openLink}
              onOpenEvents={(match) =>
                router.push({
                  pathname: '/calendar/events/[id]',
                  params: { id: match._id },
                })
              }
              onOpenVideos={(match) =>
                router.push({
                  pathname: '/calendar/videos',
                  params: { match: match._id },
                })
              }
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon="calendar"
              title={t('lineup.emptyTitle')}
              text={t(
                section === 'upcoming'
                  ? 'calendar.emptyUpcoming'
                  : 'calendar.emptyResults',
              )}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabs: {
    paddingHorizontal: theme.spacing(4),
  },
  list: {
    flexGrow: 1,
    gap: theme.spacing(2),
    padding: theme.spacing(4),
  },
}));
