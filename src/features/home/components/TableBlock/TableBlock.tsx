import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import {
  Button,
  LoadingMore,
  SectionTitle,
  StandingsTable,
} from '@/ui/components';

import { useStandingsQuery } from '@/hooks';

import { rowsAroundTeam } from '@/utils';

import type { TableBlockProps } from './types';

/**
 * Home-screen table preview: "Standings" title, our club's row with the team
 * above and below, and a button to the full table. Hidden when there's no table to show.
 */
export function TableBlock({ onShowAll, style }: TableBlockProps) {
  const { t } = useTranslation();
  const { data, isPending } = useStandingsQuery();

  if (isPending) return <LoadingMore loading />;
  if (!data) return null;

  const rows = rowsAroundTeam(data.rows, data.ourTeamId);
  if (!rows.length) return null;

  return (
    <View style={style}>
      <SectionTitle title={t('home.tableTitle')} />
      <StandingsTable
        rows={rows}
        highlightTeamId={data.ourTeamId}
        style={styles.table}
      />
      <Button
        size="xs"
        fullWidth
        text={t('home.allTable')}
        backgroundColor="brand"
        textColor="onBrand"
        onPress={onShowAll}
        style={styles.inset}
      />
    </View>
  );
}

TableBlock.displayName = 'TableBlock';

const styles = StyleSheet.create((theme) => ({
  table: {
    marginHorizontal: theme.spacing(5),
    marginBottom: theme.spacing(4),
  },
  inset: {
    marginHorizontal: theme.spacing(5),
  },
}));
