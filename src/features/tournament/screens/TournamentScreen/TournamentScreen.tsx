import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  ChoiceGroup,
  EmptyState,
  LoadingMore,
  PageLayout,
  Select,
  StandingsTable,
} from '@/ui/components';

import { useFixturesTableQuery, useLeaguesQuery } from '@/hooks';

import { goBack, leagueTitle, matchPhase, toStandingsRow } from '@/utils';

import type { Fixture } from '@/types/api';

import { MatchCard } from '@/features/matches';

import type { TournamentSection } from './types';

/**
 * "Tournament & schedule": pick a competition, then see its table or its
 * matches (upcoming first, then results). Opens on the club's league.
 */
export function TournamentScreen() {
  const { t } = useTranslation();
  const [section, setSection] = useState<TournamentSection>('table');
  const [picked, setPicked] = useState<number | null>(null);
  const { data: leagues, isPending } = useLeaguesQuery();
  const { data: fixtures } = useFixturesTableQuery();

  const defaultLeague =
    leagues?.find((l) => l.standings[0]?.length) ?? leagues?.[0];
  const league =
    leagues?.find((l) => l._id === picked) ?? defaultLeague ?? null;
  const title = league
    ? leagueTitle(league.league.name, league.league.season)
    : '';
  const rows = league?.standings[0]?.map(toStandingsRow) ?? [];

  // The backend's "future" list also holds the last played match.
  const ofLeague = (list: Fixture[]) =>
    list.filter((m) => m.league.id === league?.league.id);
  const upcoming = fixtures
    ? ofLeague(fixtures.future)
        .filter((m) => matchPhase(m.status) !== 'finished')
        .sort((a, b) => a.event_date.localeCompare(b.event_date))
    : [];
  const results = fixtures
    ? ofLeague(fixtures.past).sort((a, b) =>
        b.event_date.localeCompare(a.event_date),
      )
    : [];
  const matches = [...upcoming, ...results];

  return (
    <PageLayout
      title={t('tournament.title')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      <ChoiceGroup
        variant="tabs"
        options={[
          { label: t('tournament.table'), value: 'table' as const },
          { label: t('tournament.calendar'), value: 'calendar' as const },
        ]}
        value={section}
        onChange={setSection}
      />
      {isPending ? (
        <LoadingMore loading />
      ) : !league ? (
        <EmptyState
          icon="table"
          title={t('lineup.emptyTitle')}
          text={t('standings.emptyText')}
        />
      ) : (
        <>
          <Select
            label={t('tournament.league')}
            options={(leagues ?? []).map((l) => ({
              label: leagueTitle(l.league.name, l.league.season),
              value: l._id,
            }))}
            value={league._id}
            onChange={setPicked}
          />
          {section === 'table' ? (
            rows.length ? (
              <StandingsTable
                variant="full"
                rows={rows}
                highlightTeamId={league._teamId}
              />
            ) : (
              <EmptyState
                icon="table"
                title={t('lineup.emptyTitle')}
                text={t('tournament.noTable')}
              />
            )
          ) : matches.length ? (
            <View style={styles.matches}>
              {matches.map((match) => (
                <MatchCard
                  key={match._id}
                  variant="compact"
                  match={match}
                  title={title}
                  actions={false}
                  onOpenLink={() => {}}
                />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="calendar"
              title={t('lineup.emptyTitle')}
              text={t('tournament.noMatches')}
            />
          )}
        </>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    gap: theme.spacing(4),
    paddingHorizontal: theme.spacing(4),
  },
  matches: {
    gap: theme.spacing(2),
  },
}));
