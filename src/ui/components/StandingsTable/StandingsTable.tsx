import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Text } from '../Text';
import type { StandingsRowProps, StandingsTableProps } from './types';

const STAT_KEYS = [
  'standings.played',
  'standings.won',
  'standings.drawn',
  'standings.lost',
  'standings.points',
] as const;

/**
 * League table: a green header row, then one compact row per team. Our
 * club's row is highlighted in yellow.
 *
 * @example
 * <StandingsTable rows={rows} highlightTeamId={OUR_TEAM_ID} />
 */
export function StandingsTable({
  rows,
  highlightTeamId,
  style,
}: StandingsTableProps) {
  const { t } = useTranslation();

  return (
    <View style={style}>
      <View style={styles.header}>
        <View style={styles.teamPart}>
          <Text variant="bodySRegular" color="onBrand" style={styles.rank}>
            {t('standings.place')}
          </Text>
          <Text
            variant="bodySRegular"
            color="onBrand"
            style={styles.headerClub}
          >
            {t('standings.club')}
          </Text>
        </View>
        <View style={styles.statsPart}>
          {STAT_KEYS.map((key) => (
            <Text
              key={key}
              variant="bodySRegular"
              color="onBrand"
              style={styles.stat}
            >
              {t(key)}
            </Text>
          ))}
        </View>
      </View>
      {rows.map((row) => (
        <StandingsRow
          key={row.teamId}
          row={row}
          highlighted={row.teamId === highlightTeamId}
        />
      ))}
    </View>
  );
}

StandingsTable.displayName = 'StandingsTable';

function StandingsRow({ row, highlighted }: StandingsRowProps) {
  const { t } = useTranslation();
  const color = highlighted ? 'onHighlight' : 'foreground';
  const stats = [row.played, row.won, row.drawn, row.lost, row.points];

  return (
    <View
      accessible
      accessibilityLabel={t('standings.rowLabel', {
        rank: row.rank,
        team: row.teamName,
        played: row.played,
        won: row.won,
        drawn: row.drawn,
        lost: row.lost,
        points: row.points,
      })}
      style={[styles.row, highlighted && styles.highlighted]}
    >
      <View style={styles.teamPart}>
        <Text variant="bodySRegular" color={color} style={styles.rank}>
          {row.rank}
        </Text>
        {row.teamLogo ? (
          <Image
            source={{ uri: row.teamLogo }}
            resizeMode="contain"
            style={styles.logo}
          />
        ) : (
          <View style={styles.logo} />
        )}
        <Text
          variant="bodySRegular"
          color={color}
          numberOfLines={1}
          style={styles.teamName}
        >
          {row.teamName}
        </Text>
      </View>
      <View style={styles.statsPart}>
        {stats.map((value, i) => (
          <Text
            key={STAT_KEYS[i]}
            variant="bodySRegular"
            color={color}
            style={styles.stat}
          >
            {value}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.spacing(8),
    borderTopLeftRadius: theme.radius.sm,
    borderTopRightRadius: theme.radius.sm,
    backgroundColor: theme.colors.brand,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.spacing(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.secondary,
  },
  highlighted: {
    backgroundColor: theme.colors.highlight,
  },
  teamPart: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsPart: {
    flex: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rank: {
    flex: 0.35,
    textAlign: 'center',
  },
  headerClub: {
    flex: 0.65,
    textAlign: 'center',
  },
  logo: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  teamName: {
    flex: 1,
    paddingLeft: theme.spacing(1),
    textTransform: 'uppercase',
  },
  stat: {
    flex: 1,
    textAlign: 'center',
  },
}));
