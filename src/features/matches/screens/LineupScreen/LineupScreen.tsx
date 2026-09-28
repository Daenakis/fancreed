import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Share } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { EmptyState, PageLayout, PageLoader } from '@/ui/components';

import { useFixtureQuery } from '@/hooks';

import { goBack } from '@/utils';

import { Pitch } from '../../components';

/** A match's starting XI of our club on a pitch; empty until announced. */
export function LineupScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: match, isPending } = useFixtureQuery(Number(id));
  const lineup = match?.lineups?.find((l) => l.team.id === match._teamId);

  const share = match
    ? () =>
        void Share.share({
          message: t('lineup.shareMessage', {
            home: match.homeTeam.name,
            away: match.awayTeam.name,
          }),
        })
    : undefined;

  return (
    <PageLayout
      title={t('lineup.title')}
      onBack={goBack}
      onShare={lineup ? share : undefined}
      scrollable={!!lineup}
      contentStyle={styles.content}
    >
      {isPending ? (
        <PageLoader />
      ) : lineup?.startXI.length ? (
        <Pitch
          slots={lineup.startXI.map((player) => ({
            grid: player.grid ?? '',
            player,
          }))}
          onPressSlot={({ player }) =>
            player &&
            router.push({
              pathname: '/players/[id]',
              params: { id: player._id },
            })
          }
        />
      ) : (
        <EmptyState
          icon="info"
          title={t('lineup.emptyTitle')}
          text={t('lineup.emptyText')}
          style={styles.empty}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacing(4),
  },
  empty: {
    flex: 1,
  },
}));
