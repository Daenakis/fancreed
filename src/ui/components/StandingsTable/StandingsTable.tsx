import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { RemoteImage } from '../RemoteImage';
import { Text } from '../Text';
import type { StandingsRowProps, StandingsTableProps } from './types';

const BASE_KEYS = [
  'standings.played',
  'standings.won',
  'standings.drawn',
  'standings.lost',
] as const;
const COMPACT_KEYS = [...BASE_KEYS, 'standings.points'] as const;
const FULL_KEYS = [...BASE_KEYS, 'standings.goals'] as const;

/**
 * League table: a green header row, then one row per team; our club's row
 * is yellow. `compact` shows names and points, `full` separate rounded rows
 * with logos only and goals for-against.
 *
 * @example
 * <StandingsTable rows={rows} highlightTeamId={OUR_TEAM_ID} />
 * <StandingsTable variant="full" rows={rows} highlightTeamId={OUR_TEAM_ID} />
 */
export function StandingsTable({
  rows,
  highlightTeamId,
  variant = 'compact',
  style,
}: StandingsTableProps) {
  const { t } = useTranslation();
  const full = variant === 'full';
  const keys = full ? FULL_KEYS : COMPACT_KEYS;

  return (
    <View style={[full && styles.fullList, style]}>
      <View style={[styles.header, full && styles.fullHeader]}>
        <View style={styles.teamPart(full)}>
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
        <View style={styles.statsPart(full)}>
          {keys.map((key) => (
            <Text
              key={key}
              variant="bodySRegular"
              color="onBrand"
              style={styles.stat(key === 'standings.goals')}
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
          full={full}
        />
      ))}
    </View>
  );
}

StandingsTable.displayName = 'StandingsTable';

function StandingsRow({ row, highlighted, full }: StandingsRowProps) {
  const { t } = useTranslation();
  const color = highlighted ? 'onHighlight' : 'foreground';
  const keys = full ? FULL_KEYS : COMPACT_KEYS;
  const goals =
    row.goalsFor === undefined
      ? '–'
      : `${row.goalsFor}-${row.goalsAgainst ?? 0}`;
  const stats = [
    row.played,
    row.won,
    row.drawn,
    row.lost,
    full ? goals : row.points,
  ];

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
      style={[
        styles.row,
        full && styles.fullRow,
        highlighted && styles.highlighted,
      ]}
    >
      <View style={styles.teamPart(full)}>
        <Text variant="bodySRegular" color={color} style={styles.rank}>
          {row.rank}
        </Text>
        {row.teamLogo ? (
          <RemoteImage
            source={{ uri: row.teamLogo }}
            resizeMode="contain"
            style={styles.logo}
          />
        ) : (
          <View style={styles.logo} />
        )}
        {full ? null : (
          <Text
            variant="bodySRegular"
            color={color}
            numberOfLines={1}
            style={styles.teamName}
          >
            {row.teamName}
          </Text>
        )}
      </View>
      <View style={styles.statsPart(full)}>
        {stats.map((value, i) => (
          <Text
            key={keys[i]}
            variant="bodySRegular"
            color={color}
            style={styles.stat(keys[i] === 'standings.goals')}
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
  // Full rows: separate rounded cards with a gap.
  fullList: {
    gap: theme.spacing(1),
  },
  fullHeader: {
    height: theme.spacing(12),
    borderRadius: theme.radius.sm,
  },
  fullRow: {
    borderBottomWidth: 0,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.mintSurface,
  },
  teamPart: (full: boolean) => ({
    flex: full ? 0.25 : 0.4,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  statsPart: (full: boolean) => ({
    flex: full ? 0.75 : 0.6,
    flexDirection: 'row',
    alignItems: 'center',
  }),
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
  stat: (wide: boolean) => ({
    flex: wide ? 2 : 1,
    textAlign: 'center',
  }),
}));
