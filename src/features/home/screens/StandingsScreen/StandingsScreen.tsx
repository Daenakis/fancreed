import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native-unistyles';

import {
  EmptyState,
  LoadingMore,
  PageLayout,
  StandingsTable,
} from '@/ui/components';

import { useStandingsQuery } from '@/hooks';

import { goBack } from '@/utils';

/** The full league table of the main team, our club highlighted. */
export function StandingsScreen() {
  const { t } = useTranslation();
  const { data, isPending } = useStandingsQuery();

  return (
    <PageLayout
      title={t('home.tableTitle')}
      onBack={goBack}
      contentStyle={styles.content}
    >
      {isPending ? (
        <LoadingMore loading />
      ) : data?.rows.length ? (
        <StandingsTable rows={data.rows} highlightTeamId={data.ourTeamId} />
      ) : (
        <EmptyState
          icon="table"
          title={t('lineup.emptyTitle')}
          text={t('standings.emptyText')}
        />
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create((theme) => ({
  content: {
    paddingHorizontal: theme.spacing(4),
  },
}));
