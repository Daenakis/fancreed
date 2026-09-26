import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  BlockHeader,
  Button,
  LoadingMore,
  StandingsTable,
} from '@/ui/components';

import { useStandingsQuery } from '@/hooks';

import { rowsAroundTeam } from '@/utils';

import type { TableBlockProps } from './types';

/**
 * Home-screen table preview: our club's row with the team above and below,
 * plus a button to the full table. Hidden when there's no table to show.
 */
export function TableBlock({ onShowAll, style }: TableBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useStandingsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!data) return null;

  const rows = rowsAroundTeam(data.rows, data.ourTeamId);
  if (!rows.length) return null;

  return (
    <View style={[styles.container, style]}>
      <BlockHeader
        title={t('home.tableTitle')}
        backgroundColor="background"
        textColor="foreground"
      />
      <StandingsTable
        rows={rows}
        highlightTeamId={data.ourTeamId}
        style={styles.table}
      />
      <Button
        size="sm"
        text={t('home.allTable')}
        backgroundColor="primary"
        textColor="primaryForeground"
        onPress={onShowAll}
      />
    </View>
  );
}

TableBlock.displayName = 'TableBlock';

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    paddingBottom: theme.spacing(4),
  },
  table: {
    alignSelf: 'stretch',
    marginVertical: theme.spacing(2.5),
  },
}));
